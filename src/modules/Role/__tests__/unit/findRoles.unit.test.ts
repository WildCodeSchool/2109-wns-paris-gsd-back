import { Connection, getConnection, QueryRunner } from "typeorm";
import Role from "../../../../entity/Role";

let db: Connection

beforeAll(async () => {
  db = getConnection()
});


describe('Roles', () => {
  it('should retrieve a list of roles present in db', async () => {
    const roles = await Role.find()

    expect(roles).toBeDefined()
    expect(roles[0]).toEqual(expect.objectContaining({ id: 1, label: "ADMIN" }))
    expect(roles[1]).toEqual(expect.objectContaining({ id: 2, label: "MANAGER" }))
    expect(roles[2]).toEqual(expect.objectContaining({ id: 3, label: "DEVELOPER" }))
    expect(roles[3]).toEqual(expect.objectContaining({ id: 4, label: "USER" }))
  });

  it('should retrive an empty array when no role is created', async () => {
    const roleToDelete = await Role.find()

    const queryRunner: QueryRunner = db.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.delete(Role, roleToDelete)
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    await expect(Role.find()).resolves.toBeDefined()
    await expect(Role.find()).resolves.toEqual([])
  });
});