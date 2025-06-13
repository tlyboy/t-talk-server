import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'Authorization')

  if (!authHeader) {
    return { error: 'No token provided' }
  }

  const token = authHeader.replace('Bearer ', '')

  const { jwtSecret } = useRuntimeConfig()

  try {
    const decoded = jwt.verify(token, jwtSecret)
    return { message: 'Protected data', user: decoded }
  } catch (err) {
    return { error: 'Invalid token' }
  }
})
