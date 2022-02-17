import { ApolloServer, gql } from 'apollo-server-express'
import createServer from '../../server';
import Role, { RoleName } from '../../entity/Role';
import Task from '../../entity/Task';
import User from '../../entity/User';
import Project from '../../entity/Project';

let server: ApolloServer

beforeAll(async () => {
  server = await createServer()
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
        ending_time: new Date().getTime(),
      })

      await project.save()

      const getProjectsQuery = gql`
        query getProjects {
          getProjects {
            id,
            name,
            ending_time
          }
        }
      `

      const { data, errors } = await server.executeOperation({
        query: getProjectsQuery,
      })

      console.log(errors)

      expect(!errors).toBeTruthy()

      const expectedResult = await Project.find()
      data!.getProjects[0].id = +data!.getProjects[0].id
      expect(data!.getProjects).toEqual(expect.arrayContaining(expectedResult))
    });
  });

  describe('Add a new project', () => {
    it('should save a new project and retrieve data', async () => {
      // TODO create a project
      // * mock a mutation from front
      // * expected retrieve data and save in db.


    });
  });

  // describe('Get a project with id params', () => {
  //   it('should retrieve a data of project by id', async () => {

  //     const getProjectByIdQuery = gql`
  //       query getProjectById(id: number!) {
  //         name
  //       }
  //     `

  //     const { data, errors } = await server.executeOperation({
  //       query: getProjectByIdQuery,
  //     })

  //     expect(!errors).toBeTruthy()

  //     const expectedResult = await Project.find()
  //     data!.getProjectById[0] = +data!.getProjectById[0]
  //     expect(data!.getProjectById).toEqual(expect.arrayContaining(expectedResult))
  //   });
  // });
});