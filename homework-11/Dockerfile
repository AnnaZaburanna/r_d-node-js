FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --include=dev

COPY tsconfig.json ./
COPY src ./src

ENV NODE_ENV=production
ENV DATABASE_URL=postgres://postgres:postgres@db:5433/postgres

CMD ["npm", "run", "demo"]
