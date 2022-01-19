FROM node:lts-alpine as builder

WORKDIR /app

COPY tsconfig.json ./
COPY package*.json ./

RUN yarn

COPY src ./

RUN yarn build

