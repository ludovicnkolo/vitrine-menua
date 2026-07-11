FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# Copy built static files to NGINX HTML folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Also copy a fallback nginx conf if needed for client-side routing (React Router)
# We can just use the default nginx conf or customize it to serve index.html for all routes.
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
