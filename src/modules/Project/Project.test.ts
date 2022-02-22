import { ApolloServer, gql } from 'apollo-server-express'
import createServer from '../../server';
import Project from '../../entity/Project';
import User from '../../entity/User';
import Role, { RoleName } from '../../entity/Role';

let server: ApolloServer
let user: User

beforeAll(async () => {
  server = await createServer()

  user = User.create({
    firstName: "toto",
    lastName: "tata",
    username: "tatadetoto",
    email: "tataManager@toto.td",
    password: "lannister",
  })
  await user.save();

})

describe('Project Resolver', () => {
  describe('Get all Projects', () => {
    it('should retrieve an empty array projects', async () => {
      const getProjectsQuery = gql`
        query getProjects {
          getProjects {
            id
          }
        }
      `

      const { data, errors } = await server.executeOperation({
        query: getProjectsQuery,
      })

      expect(!errors).toBeTruthy()

      const expectedResult = await Project.find()
      expect(data!.getProjects).toEqual(expect.arrayContaining(expectedResult))
    });

    it('should retrieve a list of projects ', async () => {
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
      const { data, errors } = await server.executeOperation({
        query: getProjectsQuery,
      })

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

      const { data, errors } = await server.executeOperation({
        query: addProjectMutation,
        variables: {
          data: {
            ...variables.data,
            user_id: user.id
          }
        },
      })

      expect(!errors).toBeTruthy()

      const expectedResult = await Project.findOne({ name: variables.data.name })
      expect(data!.addProject.name).toEqual(expectedResult!.name)

    });

    it('should response an error because a user haven\'t not right access ', async () => {
      const roleDev = await Role.findOne({ label: RoleName.DEVELOPER })

      user.role = roleDev as Role;

      await user.save()

      const { errors } = await server.executeOperation({
        query: addProjectMutation,
        variables: {
          data: {
            ...variables.data,
            user_id: user.id
          }
        },
      })

      expect(errors).toBeTruthy()
    });
  });

  // TODO update project
  describe('Update a project', () => {
    it('should retrieve a message for updated successfully', async () => {

    });

    it('should throw an error when a user attempts to updated a project where isn\'t a project Owner', async () => {

    });
  });

  // TODO add new member to project
  describe('Add a member to a project', () => {
    it('should retrieve a message for added member successfully', () => {

    });

    it('should throw an error when a user attempts to add member where isn\'t manager of this', async () => {

    });

    it('should throw an error when a manager attempts to add member where isn\'t a developer', async () => {

    });
  });

  // TODO getprojectbyid
  describe('Get a project with id params', () => {
    it('should retrieve a data of project by id', async () => {

      // const getProjectByIdQuery = gql`
      //   query getProjectById(id: number!) {
      //     name
      //   }
      // `

      // const { data, errors } = await server.executeOperation({
      //   query: getProjectByIdQuery,
      // })

      // expect(!errors).toBeTruthy()

      // const expectedResult = await Project.find()
      // data!.getProjectById[0] = +data!.getProjectById[0]
      // expect(data!.getProjectById).toEqual(expect.arrayContaining(expectedResult))
    });
  });
});