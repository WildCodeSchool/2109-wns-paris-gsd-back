import { Connection, getConnection, QueryRunner, TypeORMError } from "typeorm";
import Role, { RoleName } from "../../../../entity/Role";

let db: Connection

beforeAll(async () => {
  db = getConnection()
});


describe('Add Role', () => {
  let adminRole: Role

  beforeEach(async () => {
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

    adminRole = await Role.create({ label: RoleName.ADMIN }).save();
  });

  it('should retrieve a new Role created in db', async () => {

    expect(adminRole).toBeDefined()
    expect(adminRole).toEqual(expect.objectContaining({ id: 5, label: "ADMIN" }))
  });

  it('should throw an error when attempts to create a role is already exists', async () => {
    const adminRole2 = Role.create({ label: RoleName.ADMIN })

    await expect(adminRole2.save()).rejects.toThrowError("SqliteError: UNIQUE constraint failed: role.label")
    await expect(adminRole2.save()).rejects.toBeInstanceOf(TypeORMError)
  });
});