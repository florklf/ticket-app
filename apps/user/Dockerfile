FROM node:18-alpine AS base

FROM base AS installer
RUN apk add --no-cache libc6-compat g++ make py3-pip
RUN apk update
WORKDIR /app
RUN npm install --global nx@16.0.1

COPY . .

RUN npm ci

RUN nx run user:lint:production && nx run user:build:production

RUN npm prune --omit=dev

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Automatically leverage output traces to reduce image size
COPY --from=installer --chown=nestjs:nodejs /app/package*.json .
COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nestjs:nodejs /app/dist ./dist

CMD node dist/apps/user/main.js
