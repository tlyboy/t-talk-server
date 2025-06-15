import { compare } from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: '用户名和密码不能为空',
    })
  }

  try {
    const db = useDatabase()
    const { rows } =
      await db.sql`SELECT id, nickname, username, password FROM users WHERE username = ${username}`

    if (rows.length === 0) {
      throw createError({
        statusCode: 401,
        message: '用户名或密码错误',
      })
    }

    const user = rows[0]
    const isValid = await compare(password, user.password as string)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: '用户名或密码错误',
      })
    }

    const token = generateToken(user.id as number)
    return {
      token,
      id: user.id,
      nickname: user.nickname,
      username: user.username,
    }
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: '登录失败',
    })
  }
})
