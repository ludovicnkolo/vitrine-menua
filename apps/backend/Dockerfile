FROM node:22-bookworm-slim
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts
# Copy the rest of the code
COPY . .
# We don't need a build step for vanilla Express, but we might need Prisma generation
RUN npx prisma generate || true

EXPOSE 4000
USER node
CMD ["npm", "start"]
