FROM node:20-alpine AS build
RUN apk add --no-cache openssl

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client ./
RUN npm run build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci

COPY server/app.ts server/config.ts server/tsconfig.json ./
COPY server/prisma/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate \
    && npm run build \
    && cp generated/prisma/*.node dist/generated/prisma/

FROM node:20-alpine
RUN apk add --no-cache openssl

WORKDIR /app/server
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build /app/server/package*.json ./
RUN npm ci --omit=dev --omit=optional --ignore-scripts \
    && find node_modules/@prisma/client/runtime -type f \
       \( -name '*wasm*' -o -name '*.map' \) -delete \
    && npm cache clean --force
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/client/dist /app/client/dist
COPY --from=build /app/server/prisma/schema.prisma ./prisma/schema.prisma

RUN mkdir -p uploads

EXPOSE 3001
CMD ["node", "dist/app.js"]