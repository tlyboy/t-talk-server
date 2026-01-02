export default defineEventHandler(async (event) => {
  const userId = event.context.auth.userId

  const db = useDatabase()

  // 获取用户参与的聊天列表（通过 chat_members 表）
  const { rows } = await db.sql`
    SELECT
      c.id,
      c.userId,
      c.title,
      c.type,
      c.createdAt,
      c.updatedAt,
      m.content AS lastMessage,
      m.createdAt AS lastMessageAt,
      mu.nickname AS lastMessageUser
    FROM chats c
    INNER JOIN chat_members cm ON c.id = cm.chatId
    LEFT JOIN messages m ON c.messageId = m.id
    LEFT JOIN users mu ON m.userId = mu.id
    WHERE cm.userId = ${userId}
    ORDER BY COALESCE(m.createdAt, c.createdAt) DESC
  `

  return rows
})
