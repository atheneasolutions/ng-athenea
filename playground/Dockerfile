FROM nginx:1.23
RUN mkdir -p /usr/share/nginx/html/icura
RUN chown -R www-data:www-data /usr/share/nginx/html/icura
ADD web /usr/share/nginx/html/icura
RUN rm /etc/nginx/conf.d/default.conf
ADD nginx.conf /etc/nginx/conf.d/default.conf