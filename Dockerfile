FROM node:18-alpine3.14

WORKDIR /

COPY . .

RUN npm install

EXPOSE 8080

VOLUME [ "/lyrics" ]
# CMD [ "npx","ts-node","app.ts" ]
CMD ["npm","run","start"]
