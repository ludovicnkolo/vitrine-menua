FROM node:22-bookworm-slim
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts
# Copy the rest of the code
COPY . .
# Transformation du schéma SQLite vers PostgreSQL pour la production Docker
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma && \
    sed -i 's/url      = "file:.\/dev.db"/url      = env("DATABASE_URL")/' prisma/schema.prisma

RUN ./node_modules/.bin/prisma generate || true

# Prepare data directory for SQLite with correct permissions
RUN mkdir -p /app/data && chown -R node:node /app/data /app/prisma

EXPOSE 4000
USER node
CMD ["npm", "start"]
