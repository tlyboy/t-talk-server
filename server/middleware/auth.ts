const whiteList = ['/', '/api/user/login', '/api/user/register', '/websocket']

export default defineEventHandler(async (event) => {
  const { pathname } = new URL(event.node.req.url || '', 'http://localhost')

  if (whiteList.some((path) => pathname === path)) {
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
