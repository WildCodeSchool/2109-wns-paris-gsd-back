FROM node:lts-alpine as builder

WORKDIR /app

COPY tsconfig.json ./
COPY package*.json ./

RUN yarn
RUN yarn global add typescript

COPY src ./src

RUN yarn build

FROM node:alpine

RUN mkdir app

WORKDIR /app

COPY --from=builder /app/dist /app/dist

RUN apk --no-cache add curl

COPY package*.json ./

RUN yarn install --production

CMD yarn start