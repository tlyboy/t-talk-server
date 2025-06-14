//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2025-06-13',
  runtimeConfig: {
    jwtSecret: '',
  },
  experimental: {
    database: true,
    websocket: true,
  },
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
