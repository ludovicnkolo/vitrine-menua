FROM node:22-bookworm-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
# Copy the rest of the code
COPY . .
# We don't need a build step for vanilla Express, but we might need Prisma generation
RUN npx prisma generate || true

EXPOSE 4000
USER node
CMD ["npm", "start"]
