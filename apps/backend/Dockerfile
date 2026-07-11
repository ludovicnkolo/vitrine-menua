FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
# Copy the rest of the code
COPY . .
# We don't need a build step for vanilla Express, but we might need Prisma generation
RUN npx prisma generate || true

EXPOSE 4000
CMD ["npm", "start"]
