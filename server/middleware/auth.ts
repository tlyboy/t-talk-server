const whiteList = ['/', '/v1/user/login', '/v1/user/register']

export default defineEventHandler(async (event) => {
  if (whiteList.some((path) => getRequestURL(event).pathname === path)) {
    return
  }

  const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: '未提供认证令牌',
    })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    throw createError({
      statusCode: 401,
      message: '无效的认证令牌',
    })
  }

  event.context.auth = decoded
})
