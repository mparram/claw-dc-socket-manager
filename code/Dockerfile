FROM registry.access.redhat.com/ubi9/nodejs-20:latest
USER root
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN dnf upgrade -y
RUN dnf clean all
RUN npm cache clean --force 
RUN chown -R 1001:0 /app
RUN rm -rf /app/.npm
USER 1001
EXPOSE 8080
CMD [ "sh", "-c", "node app.js" ]
