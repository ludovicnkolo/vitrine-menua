# ============================================================
#  MENUA CONSULTING — Dockerfile
#  Build multi-stage pour Next.js avec Prisma
# ============================================================

# Stage 1: Dépendances
FROM node:20-bookworm-slim AS deps
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm install

# Stage 2: Build
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Génération du client Prisma avant le build Next.js
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid 1001 nextjs

# Nécessaire pour Prisma en production
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Dossier pour stocker la DB SQLite locale (si utilisée) et les documents
RUN mkdir -p /app/data /var/menua/documents && chown -R nextjs:nodejs /app/data /var/menua/documents

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# En production OVH, on utilisera start.sh ou on appliquera directement prisma db push si besoin
CMD ["node", "server.js"]
