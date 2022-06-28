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

      const payload = { id: adminUser.id, username: adminUser.username, role: adminUser.role }
      token = mockToken(payload)


      const { data, errors } = await server.executeOperation({
        query: getRolesQuery,
      },
        { req: { ...mockRequest(token), body: { variables: {} } } } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const expectedResult = await Role.find()
      data!.getRoles[0].id = +data!.getRoles[0].id
      expect(data!.getRoles[0]).toEqual(expectedResult[0])
    });

    it('should retrieve an error if user is no ADMIN or MANAGER', async () => {
      const getRolesQuery = gql`
        query getRoles {
          getRoles {
            id
            label
          }
        }
      `
      const developerRole = await Role.findOne({ label: RoleName.DEVELOPER })
      const developer = User.create({
        firstName: "john",
        lastName: "developer",
        username: "developer",
        email: "developer@developer.td",
        password: "lennon",
        role: developerRole
      });

      await developer.save();

      const payload = { id: developer.id, username: developer.username, role: developer.role }
      token = mockToken(payload)


      const { errors } = await server.executeOperation({
        query: getRolesQuery,
      },
        { req: { ...mockRequest(token), body: { variables: {} } } } as ExpressContext
      )
      expect(errors).toBeTruthy()
      expect(errors![0].message).toEqual('Access denied! You don\'t have permission for this action!')
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

      const payload = { id: adminUser.id, username: adminUser.username, role: adminUser.role }
      token = mockToken(payload)

      const { data, errors } = await server.executeOperation({
        query: addRoleMutation,
        variables,
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const expectedResult = await Role.findOne({ label: RoleName.USER });

      expect(data!.addRole).toEqual(expect.objectContaining({ label: expectedResult!.label }));

    })
    it(`should retrieve an error when the no user ADMIN is attempt to add role`, async () => {
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

      const managerRole = await Role.findOne({ label: RoleName.MANAGER })
      const managerUser = User.create({
        firstName: "john",
        lastName: "manager",
        username: "manager",
        email: "manager@test.td",
        password: "lennon",
        role: managerRole
      });

      await managerUser.save();

      const payload = { id: managerUser.id, username: managerUser.username, role: managerUser.role }
      token = mockToken(payload)

      const { errors } = await server.executeOperation({
        query: addRoleMutation,
        variables,
      },
        { req: { ...mockRequest(token), body: { variables } } } as ExpressContext
      )

      expect(errors).toBeTruthy();
      expect(errors![0].message).toEqual('Access denied! You don\'t have permission for this action!');

    });
  })

})

