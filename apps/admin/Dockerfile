FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts --legacy-peer-deps --fetch-timeout=600000 --fetch-retry-maxtimeout=120000 --fetch-retries=5
COPY src/ ./src/
COPY public/ ./public/
COPY index.html vite.config.js nginx.conf ./
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine
# Copy built static files to NGINX HTML folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy nginx configuration for SPA routing on port 8080 (nginx-unprivileged)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
