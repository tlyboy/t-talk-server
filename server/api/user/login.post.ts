import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  const { jwtSecret } = useRuntimeConfig()

  if (username === 'admin' && password === '123456') {
    const token = jwt.sign({ username }, jwtSecret, {
      expiresIn: '1h',
    })

    return { token }
  }

  return {
    error: 'Invalid credentials',
  }
})
