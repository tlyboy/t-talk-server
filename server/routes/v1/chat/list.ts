export default defineEventHandler(async (event) => {
  const userId = event.context.auth.userId

  const db = useDatabase()
  const { rows } = await db.sql`SELECT * FROM chats WHERE userId = ${userId}`

  return rows
})
