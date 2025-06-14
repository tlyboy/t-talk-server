import jwt from 'jsonwebtoken'

const JWT_SECRET = useRuntimeConfig().jwtSecret
const JWT_EXPIRES_IN = '24h'

export const generateToken = (userId: number, nickname: string): string => {
  return jwt.sign({ userId, nickname }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export const verifyToken = (
  token: string,
): { userId: number; nickname: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; nickname: string }
  } catch (error) {
    return null
  }
}
