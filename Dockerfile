FROM  node:latest

WORKDIR /opt/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080

CMD [ "node", "api/index" ]
