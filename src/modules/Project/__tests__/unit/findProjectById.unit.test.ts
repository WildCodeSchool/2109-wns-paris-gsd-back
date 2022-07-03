import { Connection, getConnection, QueryRunner } from "typeorm";
import Project from "../../../../entity/Project";

let db: Connection

beforeAll(async () => {
  db = getConnection()
});

const projects = [
  {
    name: 'project1',
    ending_time: new Date()
  },
  {
    name: 'project2',
    ending_time: new Date()
  },
  {
    name: 'project3',
    ending_time: new Date()
  },
]

describe('Find a project by id', () => {
  beforeEach(async () => {
    const newProjects = Project.create(projects)

    const queryRunner: QueryRunner = db.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.save(newProjects)
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  });

  it('should return a project', async () => {
    await expect(Project.findOneOrFail({ id: 3 })).resolves.toBeDefined()
    await expect(Project.findOneOrFail({ id: 3 })).resolves.toBeInstanceOf(Project)
  });

  it('should return an error when no project is founded', async () => {
    await expect(Project.findOneOrFail({ id: 3 })).rejects.toThrowError(/^Could not find any entity of type "Project" matching:/ig)
  });
});