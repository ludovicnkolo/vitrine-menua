FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine
# Copy built static files to NGINX HTML folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Also copy a fallback nginx conf if needed for client-side routing (React Router)
# We can just use the default nginx conf or customize it to serve index.html for all routes.
# Because unprivileged nginx runs on 8080 by default:
RUN echo 'server { listen 8080; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
