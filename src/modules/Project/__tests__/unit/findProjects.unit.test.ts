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

describe('Find projects', () => {
  it('should return an array of projects', async () => {
    const newProjects = Project.create(projects)

    /**
     * * For more informations to applicate multiple transactions
     * ? https://orkhan.gitbook.io/typeorm/docs/transactions#using-queryrunner-to-create-and-control-state-of-single-database-connection
     */
    const queryRunner: QueryRunner = db.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.save(newProjects)
      await queryRunner.commitTransaction();
    } catch (error) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }

    const projectsInDb = await Project.find()

    expect(projectsInDb).toBeDefined()

    expect(projectsInDb[0]).toHaveProperty('name')
    expect(projectsInDb[1].name).toEqual('project2')
    expect(projectsInDb[2]).toBeInstanceOf(Project)

  });

  it('should return an empty array when are no projects', async () => {
    const projectsInDb = await Project.find()

    expect(projectsInDb).toBeDefined()
    expect(projectsInDb).toEqual([])
    expect(projectsInDb).not.toBeUndefined();
  });
});