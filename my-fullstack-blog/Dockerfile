FROM node:22-slim AS client-build
WORKDIR /app
COPY client ./client
RUN cd client && npm ci && npm run build

FROM node:22-slim
WORKDIR /app/server
COPY server .
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm ci
RUN DATABASE_URL="file:./dev.db" npx prisma generate
COPY --from=client-build /app/client/dist /app/client/dist
ENV NODE_ENV=production
CMD ["npx", "tsx", "app.ts"]