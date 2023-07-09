FROM node:18-alpine3.14

WORKDIR /

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "npx","ts-node","app.ts" ]
