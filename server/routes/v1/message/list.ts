export default defineEventHandler(async (event) => {
  const query = getQuery(event) as {
    chatId: number
    limit?: number
    offset?: number
  }

  const { chatId, limit = 50, offset = 0 } = query

  if (!chatId) {
    throw createError({
      statusCode: 400,
      message: '聊天ID不能为空',
    })
  }

  const db = useDatabase()

  // 获取消息列表，包含发送者信息
  const { rows } = await db.sql`
    SELECT
      m.id,
      m.chatId,
      m.userId,
      m.content,
      m.role,
      m.createdAt,
      u.username,
      u.nickname,
      u.avatar
    FROM messages m
    JOIN users u ON m.userId = u.id
    WHERE m.chatId = ${chatId}
    ORDER BY m.createdAt ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `

  return rows
})
