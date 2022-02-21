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
      expect(data!.getRoles[0]).toEqual(expectedResult[0])
    })
  })

  describe('mutation addRole', () => {
    it (`should add a role if label in ['ADMIN', 'USER', MANAGER, 'DEVELOPER']`, async () => {
      await Role.delete({label: RoleName.ADMIN})

        const addRoleMutation = gql`
        mutation AddRole($data: RoleInput!) {
          addRole(data: $data) {
            label
          }
        }
      `
        const variables = {
          data: {
            label: "ADMIN"
          }
        }

      const { data, errors } = await server.executeOperation({
        query: addRoleMutation,
        variables,
      })

      expect(!errors).toBeTruthy()

      const expectedResult = await Role.findOne({label: RoleName.ADMIN});

      expect(data!.addRole).toEqual(expect.objectContaining({label: expectedResult!.label}));

    })
  })

})

