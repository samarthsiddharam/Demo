FROM nginx:alpine

# Delete default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy ALL project files into nginx web folder
COPY . /usr/share/nginx/html/

# Ensure correct permissions
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
