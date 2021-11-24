import { createConnection } from 'typeorm'

export async function connectPostgres() {
  await createConnection({
    name: 'default',
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: true,
    logging: true,
    entities: ['src/entity/*.*'],
  })
}

export async function connectSqlite() {
  await createConnection({
    name: 'test-db',
    type: 'better-sqlite3',
    database: ':memory:',
    synchronize: true,
    logging: true,
    entities: ['src/entity/*.*'],
  })
}
