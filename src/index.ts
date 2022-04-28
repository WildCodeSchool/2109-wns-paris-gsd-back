import * as dotenv from 'dotenv'
import 'reflect-metadata'

import express from 'express'
import createServer from './server'
import { connectPostgres } from './createConnection'

dotenv.config()

const start = async () => {
  await connectPostgres()
  const server = await createServer()
  console.log(server)
  console.log(server)
  console.log(server)
  console.log(server)
  const app = express()

  await server.start()
  server.applyMiddleware({ app })

  app.listen(process.env.PORT || 3000, () => {
    console.log(
      ` your server started at http://localhost:${process.env.PORT || 3000}/graphql`
    )
  })
}

start()
