FROM node:22-alpine3.24 AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:22-alpine3.24
# Übergang (PK-69): Das Basisimage hinkt den Sicherheitsupdates von Alpine hinterher
# (openssl 3.5.9-r1, zlib 1.4-r0 fehlen noch). Entfernen, sobald node:22-alpine3.24 sie mitbringt.
RUN apk upgrade --no-cache
WORKDIR /app
# Commit des Arbeitsstands; GET /api/version nennt ihn (scripts/testumgebung.sh setzt ihn).
ARG VERSION=unbekannt
ENV NODE_ENV=production VERSION=$VERSION
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY public ./public
EXPOSE 8080
CMD ["node", "dist/main.js"]
