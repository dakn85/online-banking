FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:22-alpine
WORKDIR /app
# Commit des Arbeitsstands; GET /api/version nennt ihn (scripts/testumgebung.sh setzt ihn).
ARG VERSION=unbekannt
ENV NODE_ENV=production VERSION=$VERSION
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/main.js"]
