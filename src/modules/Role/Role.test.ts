import { ApolloServer, gql } from 'apollo-server-express'
import createServer from '../../server'
import Role, { RoleName } from '../../entity/Role'

let server: ApolloServer

beforeAll(async () => {
  server = await createServer()
})

describe('role resolver', () => {
  describe('Query getRoles', () => {
    it('should get all roles', async () => {
      const role = Role.create({
        label: 'ADMIN' as RoleName,
      })

      await role.save()

      const getRolesQuery = gql`
        query getRoles {
          getRoles {
            id
            label
          }
        }
      `
      const { data, errors } = await server.executeOperation({
        query: getRolesQuery,
      })

      expect(!errors).toBeTruthy()

      const expectedResult = await Role.find()
      data!.getRoles[0].id = +data!.getRoles[0].id
      expect(data!.getRoles).toEqual(expect.arrayContaining(expectedResult))
    })
  })
})
