FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
# Template is processed at container startup using BACKEND_URL env var
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
