//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2025-06-13',
  runtimeConfig: {
    jwtSecret: '',
    encryptionKey: '', // 32字节 Base64 编码的消息加密主密钥
  },
  experimental: {
    database: true,
    websocket: true,
  },
  serveStatic: true,
  database: {
    default: {
      connector: 'mysql2',
      options: {
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
      },
    },
  },
})
