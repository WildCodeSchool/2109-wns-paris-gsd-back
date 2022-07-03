import { Connection, getConnection, QueryRunner } from "typeorm";
import User from "../../../../entity/User";

let db: Connection

beforeAll(async () => {
  db = getConnection()
});

const users = [{
  firstName: 'User1',
  lastName: 'lastName1',
  username: 'username1',
  email: 'username1@user.com',
  password: 'azerty123'
}, {
  firstName: 'User2',
  lastName: 'lastName2',
  username: 'username2',
  email: 'username2@user.com',
  password: 'azerty123'
}, {
  firstName: 'User3',
  lastName: 'lastName3',
  username: 'username3',
  email: 'username3@user.com',
  password: 'azerty123'
}, {
  firstName: 'User4',
  lastName: 'lastName4',
  username: 'username4',
  email: 'username4@user.com',
  password: 'azerty123'
},
]
describe('Find users', () => {
  it('should retrieve a list of users present in db', async () => {
    const newUsers = User.create(users)

    const queryRunner: QueryRunner = db.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.save(newUsers)
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    await expect(User.find()).resolves.toBeDefined()
    await expect(User.find()).resolves.toBeInstanceOf(Array)

    const usersInDb = await User.find()

    expect(usersInDb[0]).toBeInstanceOf(User)
    expect(usersInDb[1]).toEqual(expect.objectContaining({ ...users[1] }))
    expect(usersInDb.length).toEqual(4)

  });

  it('should retrieve an empty of users when ', async () => {
    const usersEmpty = await User.find()

    expect(usersEmpty).toBeDefined()

    expect(usersEmpty).toBeInstanceOf(Array)
    expect(usersEmpty).toEqual([])

  });
});