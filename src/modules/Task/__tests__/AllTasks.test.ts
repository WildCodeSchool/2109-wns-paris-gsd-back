import { ApolloServer, ExpressContext, gql } from 'apollo-server-express'
import { DocumentNode } from 'graphql'
import createServer from '../../../server'
import User from '../../../entity/User'
import Role, { RoleName } from '../../../entity/Role'
import Project, { StatusName } from '../../../entity/Project'
import Task from '../../../entity/Task'
import { mockRequest, mockToken } from '../../../test/setup';

let server: ApolloServer
let userQuery: User


beforeAll(async () => {
  server = await createServer()

  userQuery = User.create({
    firstName: "UserQuery",
    lastName: "lastNameTest",
    username: "test",
    email: "test@test.com",
    password: "?Axerty123",
  })
  await userQuery.save();
})


describe('Get all Tasks', () => {
  let project: Project
  let taskCreator: User
  let getTasksQuery: DocumentNode

  beforeEach(async () => {
    project = Project.create({
      name: "Project test",
      ending_time: new Date()
    })
    await project.save()

    taskCreator = User.create({
      firstName: "UserTest",
      lastName: "lastNameTest",
      username: "testUser",
      email: "testUserr@test.com",
      password: "?Axerty123"
    })
    await taskCreator.save()

    const tasks = [
      {
        title: "tache1",
        description: "tache1 desc",
        ending_time: new Date(),
        advancement: 18,
        status: StatusName.NEW,
        project,
        taskCreator
      },
      {
        title: "tache2",
        description: "tache2 desc",
        ending_time: new Date(),
        advancement: 18,
        project,
        taskCreator

      }]

    const tasksInstance = tasks.map(t => Task.create(t))

    await tasksInstance[0].save()
    await tasksInstance[1].save()

    getTasksQuery = gql`
      query GetTasks {
        getTasks {
          id
          title
          project{
            name
          }
          taskCreator{
            username
          }
          advancement
          status
          description
          estimated_time
          starting_time
          ending_time
        }
      }
    `
  });

  it('should retrieve an array of all tasks', async () => {
    const roleAdmin = await Role.findOne({ label: RoleName.ADMIN })

    userQuery.role = roleAdmin as Role;

    await userQuery.save()

    const payload = { id: userQuery.id, username: userQuery.username, role: userQuery.role }

    const token = mockToken(payload)

    const { data, errors } = await server.executeOperation({
      query: getTasksQuery
    },
      { req: { ...mockRequest(token), body: { variables: {} } } } as ExpressContext
    )

    expect(!errors).toBeTruthy()

    const expectedResult = await Task.find()
    expect(+data!.getTasks[0].id).toEqual(expectedResult[0].id)
    expect(+data!.getTasks[1].id).toEqual(expectedResult[1].id)
    expect(data!.getTasks[1].title).toEqual(expectedResult[1].title)
    expect(data!.getTasks[1].title).toEqual(expectedResult[1].title)

    await Task.delete({ id: 1 })
    await Task.delete({ id: 2 })

  });

  it('should retrieve an error if an User Role get all tasks', async () => {

    const userRole = await Role.findOne({ label: RoleName.USER })

    userQuery.role = userRole as Role;

    await userQuery.save()

    const payload = { id: userQuery.id, username: userQuery.username, role: userQuery.role }

    const token = mockToken(payload)

    const { errors } = await server.executeOperation({
      query: getTasksQuery
    },
      { req: { ...mockRequest(token), body: { variables: {} } } } as ExpressContext
    )
    expect(errors).toBeTruthy()
    expect(errors![0].message).toEqual('Access denied! You don\'t have permission for this action!')
  });

});
