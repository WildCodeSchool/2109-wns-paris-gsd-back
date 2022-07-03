import { ApolloServer, ExpressContext, gql } from 'apollo-server-express'
import createServer from '../../../server'
import User from '../../../entity/User'
import Role, { RoleName } from '../../../entity/Role'
import Project, { StatusName } from '../../../entity/Project'
import Task from '../../../entity/Task'
import { mockRequest, mockToken } from '../../../test/setup';

let server: ApolloServer
let user: User

const project = {
  name: "projet1",
  ending_time: new Date(),
};

const mockUpdatedVariables = {
  title: 'Modification du titre de la tâche',
  advancement: 70,
}

const updateTaskbyIdMutation = gql`
      mutation UpdateTaskbyId($data: UpdateDeleteTaskInput!) {
        updateTaskbyId(data: $data) {
          id
        }
      }
    `;

beforeAll(async () => {
  server = await createServer()
})


describe('Update a task by your id', () => {

  beforeEach(async () => {
    user = User.create({
      firstName: "UserTest",
      lastName: "lastNameTest",
      username: "testUser",
      email: "testUserr@test.com",
      password: "?Axerty123",
    })
    await user.save();

  });

  it('should retrieve a task updated', async () => {
    const managerRole = await Role.findOne({ label: RoleName.MANAGER });

    const manager = await User.findOneOrFail({ username: 'testUser' })

    manager.role = managerRole as Role
    await manager.save()

    await Project.create(project).save()

    await Task.create({
      title: 'Test ajout d\'une tâche',
      description: 'Lorem ipsum sit dolor amet',
      advancement: 30,
      status: StatusName.NEW,
      ending_time: JSON.stringify(new Date())
    }).save()

    const task = await Task.findOneOrFail({ id: 1 })

    const projectLink = await Project.findOneOrFail({ id: 1 })

    projectLink.users = [manager] as User[]
    await projectLink.save()

    task.project = projectLink as Project
    task.taskCreator = manager as User

    await task.save()

    const variables = {
      data: {
        id: task.id,
        ...mockUpdatedVariables
      }

    }

    const payload = { id: manager.id, username: manager.username, role: manager.role }

    const token = mockToken(payload)


    const { errors } = await server.executeOperation({
      query: updateTaskbyIdMutation,
      variables
    },
      { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
    );

    expect(!errors).toBeTruthy();

    const taskUpdated = await Task.findOneOrFail({ id: 1 })
    expect(taskUpdated.id).toEqual(1)
    expect(taskUpdated.title).toEqual(mockUpdatedVariables.title)
    expect(taskUpdated.advancement).toEqual(mockUpdatedVariables.advancement)

    await Task.delete({ id: 1 })
    await Project.delete({ id: 1 })
  });

  it('should retrieve an error when the user is not member of the project', async () => {
    const managerRole = await Role.findOne({ label: RoleName.MANAGER });

    const manager = await User.findOneOrFail({ username: 'testUser' })

    manager.role = managerRole as Role
    await manager.save()

    await Project.create(project).save()

    await Task.create({
      title: 'Test ajout d\'une tâche',
      description: 'Lorem ipsum sit dolor amet',
      advancement: 30,
      status: StatusName.NEW,
      ending_time: JSON.stringify(new Date())
    }).save()

    const task = await Task.findOneOrFail({ id: 2 })

    const projectLink = await Project.findOneOrFail({ id: 2 })

    task.project = projectLink as Project
    task.taskCreator = manager as User

    await task.save()

    const variables = {
      data: {
        id: task.id,
        ...mockUpdatedVariables
      }

    }

    const payload = { id: manager.id, username: manager.username, role: manager.role }

    const token = mockToken(payload)


    const { errors } = await server.executeOperation({
      query: updateTaskbyIdMutation,
      variables
    },
      { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
    );

    expect(errors).toBeTruthy();
    expect(errors![0].message).toEqual('user is not authorized to update a task')
  });
});