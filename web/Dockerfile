FROM node:20-slim AS builder
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
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

FROM node:20-slim AS runner
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN groupadd -g 1001 nextjs && useradd -u 1001 -g nextjs -s /bin/sh -m nextjs
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nextjs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nextjs /app/node_modules/.prisma ./node_modules/.prisma
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
