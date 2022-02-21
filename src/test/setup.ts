// eslint-disable-next-line import/no-extraneous-dependencies
import Database from 'better-sqlite3'

import { connectSqlite } from '../createConnection'
import Role, { RoleName } from '../entity/Role';


let connection: any
const testdb = new Database(':memory:', {
  // verbose: console.log,
})

beforeAll(async () => {
  connection = await connectSqlite()
})

afterAll(async () => {
  connection.close()
  testdb.close()
})

beforeEach(async () => {
  const entities = connection.entityMetadatas

  entities.forEach(async (entity: any) => {
    const repository = connection.getRepository(entity.name)
    await repository.query(`DELETE FROM ${entity.tableName}`)

  })
  await Role.create({ label: RoleName.ADMIN }).save();
  await Role.create({ label: RoleName.MANAGER }).save();
  await Role.create({ label: RoleName.DEVELOPER }).save();
  await Role.create({ label: RoleName.USER }).save();
  // 2-3 projets ?
  // 1-2 taches 
  // utilisateur
  // comments
});