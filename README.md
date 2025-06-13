# T-Talk Server

🚀 **T-Talk Server** 是 T-Talk 聊天应用的服务端项目，基于 Nitro 框架开发，提供高性能的实时通信和消息存储服务。

> ⚠️ 当前项目仍在开发中，欢迎关注和参与！

## 项目简介

T-Talk Server 是 T-Talk 桌面应用的后端服务，负责处理消息的实时传输、存储和管理。采用 Nitro 框架，确保高性能和可扩展性。

## 特性

- 💬 实时消息推送
- 🔒 安全的用户认证
- 📦 消息持久化存储
- 🌐 RESTful API 接口
- ⚡ 高性能消息处理
- 🔄 WebSocket 实时通信
- 📊 消息历史记录管理
- 🔍 全文搜索支持

## 快速开始

1. 克隆项目：

   ```bash
   git clone https://github.com/tlyboy/t-talk-server.git
   cd t-talk-server
   ```

2. 安装依赖：

   ```bash
   pnpm install
   ```

3. 配置环境变量：

   ```bash
   cp .env.example .env
   ```

   然后编辑 `.env` 文件，设置必要的环境变量：
   - `JWT_SECRET`: JWT 密钥

4. 本地开发：

   ```bash
   pnpm dev
   ```

5. 构建生产版本：

   ```bash
   pnpm build
   ```

6. 启动生产服务：

   ```bash
   pnpm start
   ```

## 目录结构

```
├── server/
│   ├── api/          # API 路由
│   ├── models/       # 数据模型
│   ├── services/     # 业务逻辑
│   ├── utils/        # 工具函数
│   └── index.ts      # 服务入口
├── public/           # 静态资源
├── package.json
├── tsconfig.json
└── ...
```

## 环境要求

- Node.js 22.x
- pnpm 10.6.2 及以上
- 数据库（待定）

## 环境变量

项目使用 `.env` 文件管理环境变量，主要配置项包括：

- `JWT_SECRET`: JWT 密钥，用于用户认证
- `JWT_EXPIRES_IN`: JWT 令牌过期时间
- `CORS_ORIGIN`: 允许的跨域来源
- `PORT`: 服务器端口（默认 3000）
- `HOST`: 服务器主机（默认 0.0.0.0）
- `NODE_ENV`: 运行环境（development/production）

## API 文档

API 文档正在编写中，敬请期待...

## 进度与计划

- [x] 项目初始化与基础架构
- [ ] 用户认证系统
- [ ] 消息实时推送
- [ ] 消息持久化存储
- [ ] 文件上传服务
- [ ] API 文档生成

> 欢迎 Issue/PR 参与共建！

## 许可协议

[MIT](LICENSE) © Guany
