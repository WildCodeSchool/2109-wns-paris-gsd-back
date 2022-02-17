import { ApolloServer, gql } from 'apollo-server-express'
import Project from '../../entity/Project'
import createServer from '../../server'


let server: ApolloServer

beforeAll(async () => {
  server = await createServer()
})

describe('Project Resolver', () => {
  describe('Get all Projects', () => {
    it('should retrieve all projects', async () => {
      // * mock query front
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
      data!.getProjects[0] = +data!.getProjects[0]
      expect(data!.getProjects).toEqual(expect.arrayContaining(expectedResult))
    });
  });
});