FROM node:22-slim AS client-build
WORKDIR /app
COPY client ./client
RUN cd client && npm ci && npm run build

FROM node:22-slim
WORKDIR /app/server
COPY server .
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public" DATABASE_URL_UNPOOLED="postgresql://user:password@localhost:5432/blog?schema=public" npm ci
RUN DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public" DATABASE_URL_UNPOOLED="postgresql://user:password@localhost:5432/blog?schema=public" npx prisma generate
COPY --from=client-build /app/client/dist /app/client/dist
ENV NODE_ENV=production
CMD ["npx", "tsx", "app.ts"]
