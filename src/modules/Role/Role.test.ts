import { ApolloServer, ExpressContext, gql } from 'apollo-server-express'
import createServer from '../../server'
import User from '../../entity/User'
import Role, { RoleName } from '../../entity/Role'
import { mockRequest, mockToken } from '../../test/setup'

let server: ApolloServer
let token: string

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

      const adminRole = await Role.findOne({ label: RoleName.ADMIN })
      const adminUser = User.create({
        firstName: "john",
        lastName: "admin",
        username: "admin",
        email: "admin@toto.td",
        password: "lennon",
        role: adminRole
      });

      await adminUser.save();

      const payload = { id: adminUser.id, username: adminUser.username, role: adminUser.role.label }
      token = mockToken(payload)


      const { data, errors } = await server.executeOperation({
        query: getRolesQuery,
      },
        { req: mockRequest(token) } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const expectedResult = await Role.find()
      data!.getRoles[0].id = +data!.getRoles[0].id
      expect(data!.getRoles[0]).toEqual(expectedResult[0])
    })
  })

  describe('mutation addRole', () => {
    it(`should add a role if label in ['ADMIN', 'USER', MANAGER, 'DEVELOPER']`, async () => {
      await Role.delete({ label: RoleName.USER })

      const addRoleMutation = gql`
        mutation AddRole($data: RoleInput!) {
          addRole(data: $data) {
            label
          }
        }
      `
      const variables = {
        data: {
          label: "USER"
        }
      }

      const adminRole = await Role.findOne({ label: RoleName.ADMIN })
      const adminUser = User.create({
        firstName: "john",
        lastName: "admin",
        username: "admin",
        email: "admin@toto.td",
        password: "lennon",
        role: adminRole
      });

      await adminUser.save();

      const payload = { id: adminUser.id, username: adminUser.username, role: adminUser.role.label }
      token = mockToken(payload)

      const { data, errors } = await server.executeOperation({
        query: addRoleMutation,
        variables,
      },
        { req: mockRequest(token) } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const expectedResult = await Role.findOne({ label: RoleName.USER });

      expect(data!.addRole).toEqual(expect.objectContaining({ label: expectedResult!.label }));

    })
  })

})

