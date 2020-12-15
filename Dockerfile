FROM  node:latest

WORKDIR /opt/app
COPY package*.json ./
RUN npm install \
    && groupadd -g 1101 vishal \
    && useradd -u 1100 -g vishal vishal -s /bin/sh \

COPY . .

EXPOSE 8080

USER camuser
CMD [ "node", "api/index" ]
