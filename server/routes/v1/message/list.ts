export default defineEventHandler(async (event) => {
  const { chatId } = getQuery(event) as { chatId: number }

  const db = useDatabase()
  const { rows } = await db.sql`SELECT * FROM messages WHERE chatId = ${chatId}`

  return rows
})
