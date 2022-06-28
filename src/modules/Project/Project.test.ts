import { ApolloServer, ExpressContext, gql } from 'apollo-server-express'
import createServer from '../../server';
import Project from '../../entity/Project';
import User from '../../entity/User';
import Role, { RoleName } from '../../entity/Role';
import { mockRequest, mockToken } from '../../test/setup';

let server: ApolloServer
let user: User

beforeAll(async () => {
  server = await createServer()

  user = User.create({
    firstName: "UserTest",
    lastName: "lastNameTest",
    username: "testUser",
    email: "testUserr@test.com",
    password: "?Axerty123",
  })
  await user.save();

})

describe('Project Resolver', () => {
  describe('Get all Projects', () => {
    it('should retrieve an empty array projects when a user is ADMIN', async () => {
      const getProjectsQuery = gql`
        query getProjects {
          getProjects {
            id
          }
        }
      `
      const roleAdmin = await Role.findOne({ label: RoleName.ADMIN })

      user.role = roleAdmin as Role;

      await user.save()

      const payload = { id: user.id, username: user.username, role: user.role }

      const token = mockToken(payload)

      const { data, errors } = await server.executeOperation({
        query: getProjectsQuery
      },
        { req: { ...mockRequest(token), body: { variables: {} } } } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const expectedResult = await Project.find()
      expect(data!.getProjects).toEqual(expect.arrayContaining(expectedResult))
    });

    it('should retrieve a list of projects when the user is Manager ', async () => {
      const project = Project.create({
        name: "Project test",
        ending_time: new Date()
      })

      await project.save()

      const getProjectsQuery = gql`
        query getProjects {
          getProjects {
            id,
            name,
            starting_time,
            ending_time
          }
        }
      `

      const roleManager = await Role.findOne({ label: RoleName.MANAGER })

      user.role = roleManager as Role;

      await user.save()

      const payload = { id: user.id, username: user.username, role: user.role }

      const token = mockToken(payload)


      const { data, errors } = await server.executeOperation({
        query: getProjectsQuery,
      },
        { req: { ...mockRequest(token), body: { variables: {} } } } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const expectedResult = await Project.find()
      data!.getProjects[0].id = +data!.getProjects[0].id
      expect(data!.getProjects[0].id).toEqual(expectedResult[0].id)
    });
  });

  describe('Add a new project', () => {
    const variables = {
      data: {
        name: "A new Project",
        ending_time: new Date().toISOString(),
      }
    }

    const addProjectMutation = gql`
      mutation AddProject($data: ProjectInput!) {
        addProject(data: $data) {
          name
          starting_time
          ending_time
          users {
            id
          }
        }
      }
    `;

    it('should save a new project and retrieve data', async () => {
      const roleManager = await Role.findOne({ label: RoleName.MANAGER })

      user.role = roleManager as Role;

      await user.save()

      const payload = { id: user.id, username: user.username, role: user.role }

      const token = mockToken(payload)

      const { data, errors } = await server.executeOperation({
        query: addProjectMutation,
        variables
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const expectedResult = await Project.findOne({ name: variables.data.name })
      expect(data!.addProject.name).toEqual(expectedResult!.name)

    });

    it('should response an error because a user haven\'t not right access ', async () => {
      const roleDev = await Role.findOne({ label: RoleName.DEVELOPER })

      user.role = roleDev as Role;

      await user.save()

      const payload = { id: user.id, username: user.username, role: user.role.label }

      const token = mockToken(payload)

      const { errors } = await server.executeOperation({
        query: addProjectMutation,
        variables
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )
      expect(errors).toBeTruthy()
      expect(errors![0].message).toEqual("Access denied! You don't have permission for this action!")
    });
  });

  describe('Update a project', () => {
    it('should retrieve a message for updated successfully', async () => {
      const project = Project.create({
        name: "Project test",
        ending_time: new Date().toISOString()
      })

      await project.save()

      const roleManager = await Role.findOne({ label: RoleName.MANAGER })

      user.role = roleManager as Role;

      await user.save()

      const pushMemberInProject = await Project.findOne({ id: project.id })

      pushMemberInProject!.users = [user]

      await pushMemberInProject!.save()

      const updateProjectMutation = gql`
        mutation Mutation($data: ProjectUpdateInput!) {
          updateProject(data: $data) {
            message
          }
        }
      `
      const payload = { id: user.id, username: user.username, role: user.role }

      const token = mockToken(payload)

      const { id } = await Project.findOneOrFail({ id: project.id })

      const variables = {
        data: {
          project_id: id,
          name: 'Un nouveau nom de projet',
          ending_time: new Date().toISOString(),
        }
      }

      const { data, errors } = await server.executeOperation({
        query: updateProjectMutation,
        variables
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      expect(data!.updateProject.message).toEqual("Updated successfully")

    });

    it('should throw an error when a user attempts to updated a project where isn\'t a project Owner', async () => {
      const project = Project.create({
        name: "Project test",
        ending_time: new Date().toISOString()
      })

      await project.save()

      const roleDeveloper = await Role.findOne({ label: RoleName.ADMIN })

      user.role = roleDeveloper as Role;

      await user.save()

      const pushMemberInProject = await Project.findOne({ id: project.id })

      pushMemberInProject!.users = []

      await pushMemberInProject!.save()

      const updateProjectMutation = gql`
        mutation Mutation($data: ProjectUpdateInput!) {
          updateProject(data: $data) {
            message
          }
        }
      `
      const payload = { id: user.id, username: user.username, role: user.role }

      const token = mockToken(payload)

      const { id } = await Project.findOneOrFail({ id: project.id })

      const variables = {
        data: {
          project_id: id,
          name: 'Un nouveau nom de projet',
          ending_time: new Date().toISOString(),
        }
      }

      const { errors } = await server.executeOperation({
        query: updateProjectMutation,
        variables
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )
      expect(errors).toBeTruthy()
      expect(errors![0].message).toEqual('user has no right to update the project')
    });
  });

  describe('Add a member to a project', () => {
    it('should retrieve a message for added member successfully', async () => {
      const project = Project.create({
        name: "Project test",
        ending_time: new Date().toISOString()
      })

      await project.save()

      const roleManager = await Role.findOne({ label: RoleName.MANAGER })
      const roleDeveloper = await Role.findOne({ label: RoleName.DEVELOPER })

      user.role = roleManager as Role;

      await user.save()

      const pushMemberInProject = await Project.findOne({ id: project.id })

      pushMemberInProject!.users = [user]

      await pushMemberInProject!.save()

      const member = User.create({
        username: "member",
        firstName: "member",
        lastName: "member",
        email: "member@member.fr",
        password: "azerty123"
      })
      await member.save()

      member.role = roleDeveloper as Role
      await member.save()

      const addMemberToProjectMutation = gql`
        mutation Mutation($data: AddMemberToProjectInput!) {
          addMemberToProject(data: $data) {
            message
          }
        }
      `
      const payload = { id: user.id, username: user.username, role: user.role }

      const token = mockToken(payload)

      const { id: projectId } = await Project.findOneOrFail({ id: project.id })
      const { id: memberId } = await User.findOneOrFail({ id: member.id })

      const variables = {
        data: {
          projectId,
          memberId,
        }
      }

      const { data, errors } = await server.executeOperation({
        query: addMemberToProjectMutation,
        variables
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )

      expect(!errors).toBeTruthy()
      expect(data!.addMemberToProject.message).toEqual("Member added successfully")
    });

    it('should throw an error when a user attempts to add member where isn\'t manager of this', async () => {
      const project = Project.create({
        name: "Project test",
        ending_time: new Date().toISOString()
      })

      await project.save()

      const roleManager = await Role.findOne({ label: RoleName.MANAGER })
      const roleDeveloper = await Role.findOne({ label: RoleName.DEVELOPER })

      user.role = roleManager as Role;

      await user.save()

      const pushMemberInProject = await Project.findOne({ id: project.id })

      pushMemberInProject!.users = []

      await pushMemberInProject!.save()

      const member = User.create({
        username: "member",
        firstName: "member",
        lastName: "member",
        email: "member@member.fr",
        password: "azerty123"
      })
      await member.save()

      member.role = roleDeveloper as Role
      await member.save()

      const addMemberToProjectMutation = gql`
        mutation Mutation($data: AddMemberToProjectInput!) {
          addMemberToProject(data: $data) {
            message
          }
        }
      `
      const payload = { id: user.id, username: user.username, role: user.role }

      const token = mockToken(payload)

      const { id: projectId } = await Project.findOneOrFail({ id: project.id })
      const { id: memberId } = await User.findOneOrFail({ id: member.id })

      const variables = {
        data: {
          projectId,
          memberId,
        }
      }

      const { errors } = await server.executeOperation({
        query: addMemberToProjectMutation,
        variables
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )

      expect(errors).toBeTruthy()
      expect(errors![0].message).toEqual('You don\'t have permissions to access this one')
    });

    it('should throw an error when a manager attempts to add member where isn\'t a developer', async () => {
      const project = Project.create({
        name: "Project test",
        ending_time: new Date().toISOString()
      })

      await project.save()

      const roleManager = await Role.findOne({ label: RoleName.MANAGER })

      user.role = roleManager as Role;

      await user.save()

      const pushMemberInProject = await Project.findOne({ id: project.id })

      pushMemberInProject!.users = [user]

      await pushMemberInProject!.save()

      const member = User.create({
        username: "member",
        firstName: "member",
        lastName: "member",
        email: "member@member.fr",
        password: "azerty123",
        role: await Role.findOne({ label: RoleName.USER })
      })
      await member.save()

      const addMemberToProjectMutation = gql`
        mutation Mutation($data: AddMemberToProjectInput!) {
          addMemberToProject(data: $data) {
            message
          }
        }
      `
      const payload = { id: user.id, username: user.username, role: user.role }

      const token = mockToken(payload)

      const { id: projectId } = await Project.findOneOrFail({ id: project.id })
      const { id: memberId } = await User.findOneOrFail({ id: member.id })

      const variables = {
        data: {
          projectId,
          memberId,
        }
      }

      const { errors } = await server.executeOperation({
        query: addMemberToProjectMutation,
        variables
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )

      expect(errors).toBeTruthy()
      expect(errors![0].message).toEqual('The user isn\'t the developer you can\'t added this one')
    });
  });

  describe('Get a project with id params', () => {
    it('should retrieve a data of project by id', async () => {

      const project = Project.create({
        name: "Project test",
        ending_time: new Date().toISOString()
      })

      await project.save()

      const getProjectByIdQuery = gql`
      query GetProjectById($getProjectByIdId: Float!) {
        getProjectById(id: $getProjectByIdId) {
          id
          name
        }
      }
      `
      const roleAdmin = await Role.findOne({ label: RoleName.ADMIN })

      user.role = roleAdmin as Role;

      await user.save()

      const pushMemberInProject = await Project.findOne({ id: project.id })

      pushMemberInProject!.users = [user]

      await pushMemberInProject!.save()

      const payload = { id: user.id, username: user.username, role: user.role }

      const token = mockToken(payload)

      const { id } = await Project.findOneOrFail({ id: project.id })

      const variables = {
        getProjectByIdId: id
      }

      const { data, errors } = await server.executeOperation({
        query: getProjectByIdQuery,
        variables
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const expectedResult = await Project.find()
      expect(data!.getProjectById.name).toEqual(expectedResult[0].name)
    });

    it('should retrieve an error when the context user is no right access', async () => {

      const project = Project.create({
        name: "Project test",
        ending_time: new Date().toISOString()
      })

      await project.save()

      const getProjectByIdQuery = gql`
      query GetProjectById($getProjectByIdId: Float!) {
        getProjectById(id: $getProjectByIdId) {
          id
          name
        }
      }
      `
      const roleAdmin = await Role.findOne({ label: RoleName.ADMIN })

      user.role = roleAdmin as Role;

      await user.save()

      const payload = { id: user.id, username: user.username, role: user.role }

      const token = mockToken(payload)

      const { id } = await Project.findOneOrFail({ id: project.id })

      const variables = {
        getProjectByIdId: id
      }

      const { errors } = await server.executeOperation({
        query: getProjectByIdQuery,
        variables
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )

      expect(errors).toBeTruthy()
      expect(errors![0].message).toEqual('User is not right access')

    });
  });
});