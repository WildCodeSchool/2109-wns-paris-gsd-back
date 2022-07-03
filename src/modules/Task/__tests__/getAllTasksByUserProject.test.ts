/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { ApolloServer, ExpressContext, gql } from 'apollo-server-express'
import createServer from '../../../server'
import User from '../../../entity/User'
import Role, { RoleName } from '../../../entity/Role'
import Project, { StatusName } from '../../../entity/Project'
import Task from '../../../entity/Task'
import { mockRequest, mockToken } from '../../../test/setup';

let server: ApolloServer

beforeAll(async () => {
  server = await createServer()
})


describe('Get all tasks by user project', () => {
  it('should retrieve an array of tasks where user has member', async () => {
    const developerRole = await Role.findOne({ label: RoleName.DEVELOPER });

    const developer = User.create({
      firstName: "Developer",
      lastName: "Test",
      username: "test.dev",
      email: "test.dev@wild.com",
      password: "j.doe#45",
      role: developerRole
    });

    await developer.save();

    const projects = [
      {
        name: "projet1",
        ending_time: new Date(),
      },
      {
        name: "projet2",
        ending_time: new Date(),
      },
    ];


    const projet1 = Project.create({ ...projects[0], users: [developer] });
    await projet1.save();

    const projet2 = Project.create({ ...projects[1] });
    await projet2.save();



    const taskList = [
      {
        title: "tache1",
        description: "tache1 desc",
        ending_time: new Date(),
        advancement: 18,
        status: StatusName.NEW,

      },
      {
        title: "tache2",
        description: "tache2 desc",
        ending_time: new Date(),
        advancement: 18,
        status: StatusName.IN_PROGRESS,
      },
      {
        title: "tache3",
        description: "tache3 desc",
        ending_time: new Date(),
        advancement: 18,
        status: StatusName.DONE,
      },
      {
        title: "tache4",
        description: "tache4 desc",
        ending_time: new Date(),
        advancement: 36,
        status: StatusName.PENDING_REVIEW,
      },
      {
        title: "tache5",
        description: "tache5 desc",
        ending_time: new Date(),
        advancement: 75,
        status: StatusName.NEW,
      },
    ];

    const tasks = Task.create(taskList)
    const projectInstance1 = await Project.findOne({ id: 1 })

    const projectInstance2 = await Project.findOne({ id: 2 })

    const task1 = Task.create({ ...tasks[0] })
    await task1.save();
    await Task.update({ id: task1.id }, { ...task1, project: projectInstance1, taskCreator: developer })


    const task2 = Task.create(tasks[1])
    await task2.save();
    await Task.update({ id: task2.id }, { ...task2, project: projectInstance1, taskCreator: developer })


    const task3 = Task.create(tasks[2]);
    await task3.save();
    await Task.update({ id: task3.id }, { ...task3, project: projectInstance2 })


    const task4 = Task.create(tasks[3]);
    await task4.save();
    await Task.update({ id: task4.id }, { ...task4, project: projectInstance2 })

    const task5 = Task.create(tasks[4])
    await task5.save();
    await Task.update({ id: task5.id }, { ...task5, project: projectInstance1 })

    const getAllTasksByUserProjectQuery = gql`
    query getAllTasksByUserProject {
      getAllTasksByUserProject {
        id,
        title,
        project {
            id,
            users {
                username
            }
        }
      }
    }`;

    const payload = { id: developer.id, username: developer.username, role: developer.role }

    const token = mockToken(payload)

    const { data, errors } = await server.executeOperation({
      query: getAllTasksByUserProjectQuery,
    },
      { req: { ...mockRequest(token), body: { variables: {} } } } as ExpressContext
    );

    expect(!errors).toBeTruthy();

    expect(
      +data!.getAllTasksByUserProject[0].project.id &&
      data!.getAllTasksByUserProject[0].project.users[0].username
    ).toEqual(projet1.id && developer.username)

    expect(
      +data!.getAllTasksByUserProject[2].project.id &&
      data!.getAllTasksByUserProject[2].project.users[0].username
    ).toEqual(projet1.id && developer.username)
  });
});
