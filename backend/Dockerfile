FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY prisma ./prisma
COPY src ./src
COPY package.json ./
EXPOSE 3000
# migrate deploy runs against DATABASE_URL at container startup
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node src/server.js"]
