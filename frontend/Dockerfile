# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY favicon /usr/share/nginx/html/favicon/

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

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

# Copy static assets (resume, content)
COPY resume /usr/share/nginx/html/resume/
COPY content /usr/share/nginx/html/content/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
