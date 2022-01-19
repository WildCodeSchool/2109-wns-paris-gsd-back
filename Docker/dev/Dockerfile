FROM node:lts-alpine

WORKDIR /app

COPY ../../tsconfig.json ./
COPY ../../package*.json ./

RUN yarn

COPY ../../src ./src

CMD yarn start:dev

