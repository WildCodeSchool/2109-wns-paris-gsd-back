import * as dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'reflect-metadata'

import express from 'express'
import createServer from './server'
import { connectPostgres } from './createConnection'

dotenv.config()

const start = async () => {
  await connectPostgres()
  const app = express()

  const corsOptions = {
    origin: ['http://localhost:3000',  'https://studio.apollographql.com'],
    credentials: true,
  }

  app.use(cors(corsOptions))
  app.use(cookieParser());

  const server = await createServer()

  await server.start()
  server.applyMiddleware({ app, cors: false })

  app.listen(process.env.PORT || 3000, () => {
    console.log(
      ` your server started at http://localhost:${process.env.PORT || 3000}/graphql`
    )
  })
}

start()
