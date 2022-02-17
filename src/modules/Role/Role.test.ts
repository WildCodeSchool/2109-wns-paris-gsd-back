import { ApolloServer, gql } from 'apollo-server-express'
import createServer from '../../server'
import Role from '../../entity/Role'

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

  // describe('mutation addRole', () => {
  //   it (`should add a role if label in ['ADMIN', 'USER', MANAGER, 'DEVELOPER']`, async () => {
  //       const addRoleMutation = gql`
  //       mutation AddRole($data: RoleInput!) {
  //         addRole(data: $data) {
  //           label
  //         }
  //       }
  //     `
  //       const variables = {
  //         data: {
  //           label: "ADMIN"
  //         }
  //       }

  //     const { data, errors } = await server.executeOperation({
  //       query: addRoleMutation,
  //       variables,
  //     })

  //     expect(!errors).toBeTruthy()

  //     const expectedResult = await Role.findOne<Role>({label: 'ADMIN' as RoleName});

  //     expect(data!.addRole).toEqual(expect.objectContaining({label: expectedResult!.label}));

  //   })

  //! doesn't work because of fucking sqlite 3 not having enums
  //   it (`should render error if label NOT in ['ADMIN', 'USER', MANAGER, 'DEVELOPER']`, async () => {
  //     const addRoleMutation = gql`
  //     mutation AddRole($data: RoleInput!) {
  //       addRole(data: $data) {
  //         label
  //       }
  //     }
  //   `

  //     const variables = {
  //       data: {
  //         label: "pouet"
  //       }
  //     }

  //   const { data, errors } = await server.executeOperation({
  //     query: addRoleMutation,
  //     variables,
  //   })


  //   console.log(errors)
  //   console.log(data)
  //   // expect(!data && errors).toBeTruthy();


  // })

})

