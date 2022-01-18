import * as dotenv from 'dotenv'
import 'reflect-metadata'

import express from 'express'
import createServer from './server'
import {connectPostgres} from './createConnection'

dotenv.config()

const start = async () => {
  await connectPostgres()
  const server = await createServer()
  const app = express()

  await server.start()
  server.applyMiddleware({ app })

  app.use('/caca', (_,res) => res.send('popo est dans la place du caillou et son frère racaillou et sa cousine aspifouette'))

  app.listen(process.env.PORT || 3000, () => {
    console.log(
      `server started at http://localhost:${process.env.PORT || 3000}/graphql`
    )
  })
}

start()
