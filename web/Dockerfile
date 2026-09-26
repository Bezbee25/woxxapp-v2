# Stage 1: Builder (Fast Compilation)
FROM node:26-alpine AS builder
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache libc6-compat openssl python3 make g++ build-base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

ENV DATABASE_URL="postgresql://build:build@localhost:5432/woxxapp"
ENV JWT_SECRET="build-secret-jwt-key-32-chars-minimum"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Stage 2: Runner Ultra-Léger & Sécurisé (Zéro CVE)
FROM node:26-alpine AS runner
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache libc6-compat openssl && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
