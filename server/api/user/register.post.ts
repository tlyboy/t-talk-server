import { hash } from 'bcrypt'

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
    const hashedPassword = await hash(password, 10)
    const db = useDatabase()
    await db.sql`INSERT INTO users (username, password) VALUES (${username}, ${hashedPassword})`

    return {
      success: true,
      message: '注册成功',
    }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 400,
        message: '用户名已存在',
      })
    }
    throw createError({
      statusCode: 500,
      message: '注册失败',
    })
  }
})
