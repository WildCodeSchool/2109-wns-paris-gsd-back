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

describe('Get one task by id', () => {
  it('should retrieve a task by your id', async () => {
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
    ];

    const tasks = Task.create(taskList)
    const projectInstance1 = await Project.findOne({ id: 1 })

    const task1 = Task.create({ ...tasks[0] })
    await task1.save();
    await Task.update({ id: task1.id }, { ...task1, project: projectInstance1, taskCreator: developer })

    const task2 = Task.create(tasks[1])
    await task2.save();
    await Task.update({ id: task2.id }, { ...task2, project: projectInstance1, taskCreator: developer })


    const getTaskByIdQuery = gql`
    query GetTaskById($data: TaskIdInput!) {
      getTaskById(data: $data) {
        id
        title
        description
        starting_time
        ending_time
        advancement
        status
        project {
          id
          name
          starting_time
          ending_time
        }
        taskCreator {
          id
          username
        }
      }
    }
  `;

    const variables = {
      data: {
        taskId: task1.id
      }
    }

    const payload = { id: developer.id, username: developer.username, role: developer.role }

    const token = mockToken(payload)

    const { data, errors } = await server.executeOperation({
      query: getTaskByIdQuery,
      variables
    },
      { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
    );

    expect(!errors).toBeTruthy();

    expect(+data!.getTaskById.id).toEqual(task1.id)
    expect(data!.getTaskById.title).toEqual(task1.title)
    expect(+data!.getTaskById.project.id).toEqual(projectInstance1!.id)
  });
});
