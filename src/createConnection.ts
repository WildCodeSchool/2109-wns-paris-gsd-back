import { createConnection } from 'typeorm'

export async function connectPostgres() {
  await createConnection({
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: true,
    logging: true,
    entities: ['src/entity/*.*'],
  })
}

export async function connectSqlite() {
  const connection = await createConnection({
    type: 'better-sqlite3',
    database: ':memory:',
    synchronize: true,
    logging: true,
    entities: ['src/entity/*.*'],
  })

  return connection;
}
