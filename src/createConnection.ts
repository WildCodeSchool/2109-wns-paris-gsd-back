import dotenv from 'dotenv';
import { createConnection } from 'typeorm'

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? 'env-dev.env' : 'env-prod.env'
})

export async function connectPostgres() {
  await createConnection({
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: true,
    logging: true,
    entities: [process.env.TYPEORM_ENTITIES as string],
  })
}

export async function connectSqlite() {
  const connection = await createConnection({
    type: 'better-sqlite3',
    database: ':memory:',
    synchronize: true,
    // logging: true,
    entities: [process.env.TYPEORM_ENTITIES as string],
  })

  return connection;
}
