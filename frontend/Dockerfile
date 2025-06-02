# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=build /app/dist /usr/share/nginx/html/

# Copy static assets (resume, content, favicon)
COPY resume /usr/share/nginx/html/resume/
COPY content /usr/share/nginx/html/content/
COPY favicon /usr/share/nginx/html/favicon/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
