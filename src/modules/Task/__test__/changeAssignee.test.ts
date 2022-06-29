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

const changeAssigneeMutation = gql`
      mutation ChangeAssignee($data: ChangeAssigneeInput!) {
        changeAssignee(data: $data) {
          id,
          taskCreator {
            id
            username
          }
        }
      }
    `;

beforeAll(async () => {
  server = await createServer()
})

describe('Change member of the task', () => {
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

  it('should retrieve a new member assigned on the task', async () => {
    const managerRole = await Role.findOne({ label: RoleName.MANAGER });
    const developerRole = await Role.findOne({ label: RoleName.DEVELOPER })

    const manager = await User.findOneOrFail({ username: 'test' })

    manager.role = managerRole as Role
    await manager.save()

    await Project.create(project).save()

    await User.create({
      firstName: "UserTest",
      lastName: "lastNameTest",
      username: "testUser",
      email: "testUserr@test.com",
      password: "?Axerty123",
      role: developerRole
    }).save();


    await Task.create({
      title: 'Test ajout d\'une tâche',
      description: 'Lorem ipsum sit dolor amet',
      advancement: 30,
      status: StatusName.NEW,
      ending_time: JSON.stringify(new Date())
    }).save();

    const task = await Task.findOneOrFail({ title: 'Test ajout d\'une tâche' });
    const userToAssignee = await User.findOneOrFail({ username: 'testUser' })

    const projectLink = await Project.findOneOrFail({ id: 1 });

    projectLink.users = [manager, userToAssignee] as User[];
    await projectLink.save();

    task.project = projectLink as Project;

    await task.save();

    const payload = { id: manager.id, username: manager.username, role: manager.role };

    const token = mockToken(payload);


    const variables = {
      data: {
        id: task.id,
        creator_id: userToAssignee.id
      }
    }

    const { errors } = await server.executeOperation({
      query: changeAssigneeMutation,
      variables
    },
      { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
    )

    expect(!errors).toBeTruthy();
    const newMemberAssignee = await Task.findOneOrFail({
      title: 'Test ajout d\'une tâche'
    }, {
      relations: ['taskCreator']
    });

    expect(newMemberAssignee.taskCreator).toEqual(userToAssignee)

    await Task.delete({ id: newMemberAssignee.id })
  });

  it('should retrieve an error when the user is not member on this project', async () => {
    const managerRole = await Role.findOne({ label: RoleName.MANAGER });
    const developerRole = await Role.findOne({ label: RoleName.DEVELOPER })

    const manager = await User.findOneOrFail({ username: 'test' })

    manager.role = managerRole as Role
    await manager.save()

    await Project.create(project).save()

    await User.create({
      firstName: "UserTest",
      lastName: "lastNameTest",
      username: "testUser",
      email: "testUserr@test.com",
      password: "?Axerty123",
      role: developerRole
    }).save();


    await Task.create({
      title: 'Test ajout d\'une tâche',
      description: 'Lorem ipsum sit dolor amet',
      advancement: 30,
      status: StatusName.NEW,
      ending_time: JSON.stringify(new Date())
    }).save();

    const task = await Task.findOneOrFail({ title: 'Test ajout d\'une tâche' });
    const userToAssignee = await User.findOneOrFail({ username: 'testUser' })

    const projectLink = await Project.findOneOrFail({ name: 'projet1' });

    projectLink.users = [userToAssignee] as User[];
    await projectLink.save();

    task.project = projectLink as Project;

    await task.save();

    const payload = { id: manager.id, username: manager.username, role: manager.role };

    const token = mockToken(payload);


    const variables = {
      data: {
        id: task.id,
        creator_id: userToAssignee.id
      }
    }

    const { errors } = await server.executeOperation({
      query: changeAssigneeMutation,
      variables
    },
      { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
    )

    expect(errors).toBeTruthy();
    expect(errors![0].message).toEqual("User can't change assignee")

    await Task.delete({ title: 'Test ajout d\'une tâche' })
    await Project.delete({ name: 'projet1' })
  });

  it('should retrieve an error when the user is not assignee member on this project', async () => {
    const managerRole = await Role.findOne({ label: RoleName.MANAGER });
    const developerRole = await Role.findOne({ label: RoleName.DEVELOPER })

    const manager = await User.findOneOrFail({ username: 'test' })

    manager.role = managerRole as Role
    await manager.save()

    await Project.create(project).save()

    await User.create({
      firstName: "UserTest",
      lastName: "lastNameTest",
      username: "testUser",
      email: "testUserr@test.com",
      password: "?Axerty123",
      role: developerRole
    }).save();


    await Task.create({
      title: 'Test ajout d\'une tâche',
      description: 'Lorem ipsum sit dolor amet',
      advancement: 30,
      status: StatusName.NEW,
      ending_time: JSON.stringify(new Date())
    }).save();

    const task = await Task.findOneOrFail({ title: 'Test ajout d\'une tâche' });
    const userToAssignee = await User.findOneOrFail({ username: 'testUser' })

    const projectLink = await Project.findOneOrFail({ name: 'projet1' });

    projectLink.users = [manager] as User[];
    await projectLink.save();

    task.project = projectLink as Project;

    await task.save();

    const payload = { id: manager.id, username: manager.username, role: manager.role };

    const token = mockToken(payload);


    const variables = {
      data: {
        id: task.id,
        creator_id: userToAssignee.id
      }
    }

    const { errors } = await server.executeOperation({
      query: changeAssigneeMutation,
      variables
    },
      { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
    )

    expect(errors).toBeTruthy();
    expect(errors![0].message).toEqual("User can't be assigned to this project")

    await Task.delete({ title: 'Test ajout d\'une tâche' })
    await Project.delete({ name: 'projet1' })
  });

  it('should retrieve an error when the user is developer and attempt to change assignee', async () => {
    const developerRole = await Role.findOne({ label: RoleName.DEVELOPER })

    const developer = await User.findOneOrFail({ username: 'test' })

    developer.role = developerRole as Role
    await developer.save()

    await Project.create(project).save()

    await User.create({
      firstName: "UserTest",
      lastName: "lastNameTest",
      username: "testUser",
      email: "testUserr@test.com",
      password: "?Axerty123",
      role: developerRole
    }).save();


    await Task.create({
      title: 'Test ajout d\'une tâche',
      description: 'Lorem ipsum sit dolor amet',
      advancement: 30,
      status: StatusName.NEW,
      ending_time: JSON.stringify(new Date())
    }).save();

    const task = await Task.findOneOrFail({ title: 'Test ajout d\'une tâche' });
    const userToAssignee = await User.findOneOrFail({ username: 'testUser' })

    const projectLink = await Project.findOneOrFail({ name: 'projet1' });

    projectLink.users = [developer] as User[];
    await projectLink.save();

    task.project = projectLink as Project;

    await task.save();

    const payload = { id: developer.id, username: developer.username, role: developer.role };

    const token = mockToken(payload);


    const variables = {
      data: {
        id: task.id,
        creator_id: userToAssignee.id
      }
    }

    const { errors } = await server.executeOperation({
      query: changeAssigneeMutation,
      variables
    },
      { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
    )

    expect(errors).toBeTruthy();
    expect(errors![0].message).toEqual("Access denied! You don't have permission for this action!")
  });
});