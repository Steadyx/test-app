FROM nginx:alpine

# Copy the Nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the index.html file to the web root
COPY index.html /usr/share/nginx/html/

# Expose the default Nginx port
EXPOSE 80
