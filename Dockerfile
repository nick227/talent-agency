FROM node:20-alpine AS base
RUN npm install -g pnpm@9
WORKDIR /app

# Install deps
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/db/package.json ./packages/db/
COPY packages/api-spec/package.json ./packages/api-spec/
COPY packages/sdk/package.json ./packages/sdk/
COPY apps/server/package.json ./apps/server/
RUN pnpm install --frozen-lockfile

# Build server
FROM base AS server-build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY . .
RUN pnpm --filter @talent/db generate
RUN pnpm --filter server build

# Build web
FROM base AS web-build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/sdk/node_modules ./packages/sdk/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
RUN pnpm --filter @talent/sdk sdk:generate
RUN pnpm --filter web build

# Production image
FROM node:20-alpine AS production
RUN npm install -g pnpm@9
WORKDIR /app

COPY --from=server-build /app/apps/server/dist ./apps/server/dist
COPY --from=server-build /app/packages/db ./packages/db
COPY --from=web-build /app/apps/web/dist ./apps/web/dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY pnpm-workspace.yaml package.json ./
COPY apps/server/package.json ./apps/server/
COPY packages/db/package.json ./packages/db/

# Serve static files from server
COPY --from=web-build /app/apps/web/dist ./apps/server/dist/public

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "apps/server/dist/index.js"]
