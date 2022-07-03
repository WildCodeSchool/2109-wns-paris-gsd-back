import { ApolloServer, ExpressContext, gql } from 'apollo-server-express'
import createServer from '../../../server'
import User from '../../../entity/User'
import Role, { RoleName } from '../../../entity/Role'
import Project, { StatusName } from '../../../entity/Project'
import Task from '../../../entity/Task'
import { mockRequest, mockToken } from '../../../test/setup';

let server: ApolloServer
let userQuery: User

const project = {
  name: "projet1",
  ending_time: new Date(),
};

const mockVariables = {
  title: 'Test ajout d\'une tâche',
  description: 'Lorem ipsum sit dolor amet',
  advancement: 30,
  status: StatusName.NEW,
  ending_time: JSON.stringify(new Date())
}

const addTaskMutation = gql`
      mutation AddTask($data: TaskInput!) {
        addTask(data: $data) {
          id,
          title,
          description,
          project {
            id,
            users {
              username
            }
          }
        }
      }
    `;

beforeAll(async () => {
  server = await createServer()
})


describe('Add a new task', () => {

  beforeEach(async () => {
    userQuery = User.create({
      firstName: "test",
      lastName: "Test",
      username: "test",
      email: "test@wild.com",
      password: "j.doe#45",
    });

    await userQuery.save();
  });



  it('should retrieve a task created', async () => {
    const managerRole = await Role.findOne({ label: RoleName.MANAGER });

    const manager = await User.findOneOrFail({ username: 'test' })

    manager.role = managerRole as Role
    await manager.save()

    await Project.create(project).save()



    const { id: projectId } = await Project.findOneOrFail({ name: 'projet1' })

    const variables = {
      data: {
        projectId,
        ...mockVariables
      }

    }

    const payload = { id: manager.id, username: manager.username, role: manager.role }

    const token = mockToken(payload)


    const { errors } = await server.executeOperation({
      query: addTaskMutation,
      variables
    },
      { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
    );

    expect(!errors).toBeTruthy();

    const task = await Task.findOneOrFail({ id: 1 })
    expect(task.id).toEqual(1)
    expect(task.title).toEqual(mockVariables.title)
    expect(task.description).toEqual(mockVariables.description)


    await Task.delete({ id: 1 })
    await Project.delete({ id: 1 })

  });

  it('should an error when a developer (Role) user attempts to add a task ', async () => {
    const developerRole = await Role.findOne({ label: RoleName.DEVELOPER });

    const developer = await User.findOneOrFail({ username: 'test' })

    developer.role = developerRole as Role
    await developer.save()

    await Project.create({ ...project, name: 'projet2' }).save()

    const { id: projectId } = await Project.findOneOrFail({ name: 'projet2' })

    const variables = {
      data: {
        projectId,
        ...mockVariables
      }
    }
    const payload = { id: developer.id, username: developer.username, role: developer.role }

    const token = mockToken(payload)


    const { errors } = await server.executeOperation({
      query: addTaskMutation,
      variables
    },
      { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
    );

    expect(errors).toBeTruthy();
    expect(errors![0].message).toEqual('Access denied! You don\'t have permission for this action!')
  });
});
