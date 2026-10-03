FROM oven/bun:1.3 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1.3
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock bunfig.toml tsconfig.json ./
COPY src ./src
COPY cert.pem key.pem ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "src/index.ts"]
