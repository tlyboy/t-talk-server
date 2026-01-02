import { wsManager } from '../utils/ws-manager'

export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] 新连接')

    // 从 URL 获取 token 进行认证
    // Nitro WebSocket 目前没有直接获取 URL 的方式，所以先接受连接
    // 认证将在第一条消息中处理
  },

  async message(peer, message) {
    try {
      const data = JSON.parse(message.text())
      console.log('[ws] 收到消息:', data.type)

      switch (data.type) {
        case 'auth': {
          // 处理认证
          const token = data.payload?.token
          if (!token) {
            peer.send(
              JSON.stringify({
                type: 'auth:error',
                payload: { message: '未提供认证令牌' },
              }),
            )
            return
          }

          const decoded = verifyToken(token)
          if (!decoded) {
            peer.send(
              JSON.stringify({
                type: 'auth:error',
                payload: { message: '令牌无效或已过期' },
              }),
            )
            return
          }

          // 注册连接
          wsManager.addConnection(decoded.userId, peer)

          // 发送认证成功
          peer.send(
            JSON.stringify({
              type: 'auth:success',
              payload: { userId: decoded.userId },
              timestamp: Date.now(),
            }),
          )

          // 获取好友列表，只通知好友用户上线
          const db = useDatabase()
          const { rows: friends } = await db.sql`
            SELECT friendId FROM friends
            WHERE userId = ${decoded.userId} AND status = 'accepted'
          `
          const friendIds = (friends as any[]).map((f) => f.friendId)

          if (friendIds.length > 0) {
            wsManager.broadcastToUsers(friendIds, {
              type: 'friend:online',
              payload: { friendId: decoded.userId },
            })
          }
          break
        }

        case 'ping': {
          // 心跳响应
          peer.send(
            JSON.stringify({
              type: 'pong',
              timestamp: Date.now(),
            }),
          )
          break
        }

        case 'message:send': {
          // 通过 WebSocket 发送消息（备用方案，主要通过 HTTP API）
          const userId = wsManager.getUserId(peer)
          if (!userId) {
            peer.send(
              JSON.stringify({
                type: 'error',
                payload: { message: '未认证，请先发送 auth 消息' },
              }),
            )
            return
          }

          const { chatId, content } = data.payload || {}
          if (!chatId || !content) {
            peer.send(
              JSON.stringify({
                type: 'error',
                payload: { message: '缺少 chatId 或 content' },
              }),
            )
            return
          }

          // 检查用户是否为聊天成员
          const db = useDatabase()
          const { rows: memberCheck } = await db.sql`
            SELECT id FROM chat_members
            WHERE chatId = ${chatId} AND userId = ${userId}
          `

          if (memberCheck.length === 0) {
            peer.send(
              JSON.stringify({
                type: 'error',
                payload: { message: '您不是该聊天的成员' },
              }),
            )
            return
          }

          const result = await db.sql`
            INSERT INTO messages (chatId, userId, content, role)
            VALUES (${chatId}, ${userId}, ${content}, 'user')
          `

          // MySQL 使用 insertId，SQLite 使用 lastInsertRowid
          const messageId = (result as any).insertId || result.lastInsertRowid

          // 获取完整消息信息
          const { rows } = await db.sql`
            SELECT
              m.id, m.chatId, m.userId, m.content, m.role, m.createdAt,
              u.username, u.nickname
            FROM messages m
            JOIN users u ON m.userId = u.id
            WHERE m.id = ${messageId}
          `

          const newMessage = rows[0]

          // 更新聊天的最后消息ID
          await db.sql`
            UPDATE chats SET messageId = ${messageId} WHERE id = ${chatId}
          `

          // 从 chat_members 获取所有成员并广播
          const { rows: members } = await db.sql`
            SELECT userId FROM chat_members WHERE chatId = ${chatId}
          `

          if (members.length > 0) {
            // 获取所有参与者（包括发送者自己，以同步多端）
            const recipientIds = (members as any[]).map((m) => m.userId)
            wsManager.broadcastToUsers(recipientIds, {
              type: 'message:new',
              payload: {
                chatId,
                message: newMessage,
              },
            })
          }
          break
        }

        default: {
          peer.send(
            JSON.stringify({
              type: 'error',
              payload: { message: `未知消息类型: ${data.type}` },
            }),
          )
        }
      }
    } catch (error) {
      console.error('[ws] 消息处理错误:', error)
      peer.send(
        JSON.stringify({
          type: 'error',
          payload: { message: '消息格式错误，请发送 JSON' },
        }),
      )
    }
  },

  async close(peer, event) {
    const userId = wsManager.removeConnection(peer)
    console.log('[ws] 连接关闭, userId:', userId)

    // 如果用户完全离线，只通知好友
    if (userId && !wsManager.isUserOnline(userId)) {
      const db = useDatabase()
      const { rows: friends } = await db.sql`
        SELECT friendId FROM friends
        WHERE userId = ${userId} AND status = 'accepted'
      `
      const friendIds = (friends as any[]).map((f: any) => f.friendId)

      if (friendIds.length > 0) {
        wsManager.broadcastToUsers(friendIds, {
          type: 'friend:offline',
          payload: { friendId: userId },
        })
      }
    }
  },

  error(peer, error) {
    console.error('[ws] 错误:', error)
    wsManager.removeConnection(peer)
  },
})
