FROM node:20-alpine AS build
RUN apk add --no-cache openssl

WORKDIR /app
COPY client ./client
RUN cd client && npm ci && npm run build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci

COPY server/app.ts server/config.ts server/tsconfig.json ./
COPY server/prisma/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate \
    && npm run build \
    && cp generated/prisma/*.node dist/generated/prisma/ \
    && npm prune --omit=dev

FROM node:20-alpine
RUN apk add --no-cache openssl

WORKDIR /app/server
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build /app/server/package*.json ./
COPY --from=build /app/server/node_modules ./node_modules
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/client/dist /app/client/dist

RUN mkdir -p uploads

EXPOSE 3001
CMD ["node", "dist/app.js"]