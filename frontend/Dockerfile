FROM nginx:alpine

# Nginx vhost
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Your site files
COPY index.html /usr/share/nginx/html/
COPY resume      /usr/share/nginx/html/resume/

EXPOSE 80
