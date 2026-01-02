FROM node:24-alpine AS build-stage

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm install --frozen-lockfile

# 构建时需要数据库配置
ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG MYSQL_DATABASE
ARG MYSQL_HOST
ARG MYSQL_PORT

ENV MYSQL_USER=$MYSQL_USER
ENV MYSQL_PASSWORD=$MYSQL_PASSWORD
ENV MYSQL_DATABASE=$MYSQL_DATABASE
ENV MYSQL_HOST=$MYSQL_HOST
ENV MYSQL_PORT=$MYSQL_PORT

COPY . .
RUN pnpm run build

FROM node:24-alpine AS production-stage

COPY --from=build-stage /app/.output /app
EXPOSE 3000

CMD ["node", "/app/server/index.mjs"]
