FROM node:22-bookworm-slim
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
# Copie sélective pour éviter l'inclusion de fichiers sensibles
COPY src/ ./src/
COPY prisma/ ./prisma/
COPY seed_imap.js ./
COPY seed_admin.js ./
# Transformation du schéma SQLite vers PostgreSQL pour la production Docker
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma && \
    sed -i 's/url      = "file:.\/dev.db"/url      = env("DATABASE_URL")/' prisma/schema.prisma && \
    ./node_modules/.bin/prisma generate || true && \
    mkdir -p /app/data && chown -R node:node /app

EXPOSE 4000
USER node
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm start"]
