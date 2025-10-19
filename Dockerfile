# Use lightweight nginx image to serve static files
FROM nginx:alpine

# Remove default nginx config and add our own
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy site content
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx (default CMD from image will run)
