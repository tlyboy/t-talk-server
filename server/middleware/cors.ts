export default defineEventHandler((event) => {
  const origin = getHeader(event, 'Origin') || '*'

  setHeader(event, 'Access-Control-Allow-Origin', origin)
  setHeader(
    event,
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,OPTIONS',
  )
  setHeader(
    event,
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  )
  setHeader(event, 'Access-Control-Allow-Credentials', 'true')

  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
  }
})
