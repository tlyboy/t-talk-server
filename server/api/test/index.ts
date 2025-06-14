export default defineEventHandler(async (event) => {
  const user = event.context.user

  const db = useDatabase()

  const { rows } = await db.sql`SELECT * FROM users`

  return { message: 'Secure data', user, rows }
})
