FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Remove the IPv6 entrypoint script to prevent Nginx from enabling IPv6
RUN rm /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

# Copy your custom Nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy frontend static files
COPY index.html /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
