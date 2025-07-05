# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# Runtime stage
FROM alpine:3.19
RUN apk add --no-cache nodejs tini
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY package.json ./
USER 1000
ENTRYPOINT ["/sbin/tini","--"]
CMD ["node","dist/main.js"]
EXPOSE 3000