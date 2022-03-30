import { ApolloServer, ExpressContext, gql } from 'apollo-server-express'

import { Secret, sign } from 'jsonwebtoken'
import createServer from '../../server'
import User from '../../entity/User'
import Role, { RoleName } from '../../entity/Role'
import UserInput from './UserInput/UserInput'

let server: ApolloServer

const mockRequest = (token: string = '') => (
  {
    headers: {
      authorization: token,
    }
  }
)

const mockToken = (payload: {}) => (
  sign(
    payload,
    process.env.JSON_TOKEN_KEY as Secret,
    { expiresIn: '24h' }
  )
)


beforeAll(async () => {
  server = await createServer()
})

describe('login resolver', () => {
  describe('Add User mutation', () => {
    it('Create a user and retrieve a user created', async () => {
      const addUserMutation = gql`
      mutation Mutation($data: UserInput!) {
        addUser(data: $data) {
          firstName
          lastName
          username
          email
        }
      }
      `

      const variables = {
        data: {
          firstName: "toto",
          lastName: "tata",
          username: "tatadetoto",
          email: "tata@toto.td",
          password: "lannister"
        }
      }

      const { data, errors } = await server.executeOperation(
        {
          query: addUserMutation,
          variables,
        },
        { req: mockRequest() } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const expectedResult = await User.findOne<User>({ email: 'tata@toto.td' })

      expect(data!.addUser).toEqual(expect.objectContaining({
        firstName: expectedResult!.firstName,
        lastName: expectedResult!.lastName,
        username: expectedResult!.username,
        email: expectedResult!.email
      }));

    })
  })

  describe('Get users query', () => {
    it('should retrieve a list of users', async () => {
      const users: UserInput[] = [
        {
          firstName: "Regis",
          lastName: "Damour",
          username: "R.damour",
          email: "r.damour@wild.com",
          password: "password"
        },
        {
          firstName: "Gerard",
          lastName: "DesDieu",
          username: "G.desdieu",
          email: "g.desdieu@wild.com",
          password: "password"
        },
        {
          firstName: "Francis",
          lastName: "Palan",
          username: "F.palan",
          email: "f.palan@wild.com",
          password: "password"
        },
      ]

      // TODO make a loop for performance but now failed because MAX WORKERS CHILD PROCESS
      const userCreated1 = User.create(users[0])
      await userCreated1.save();

      const userCreated2 = User.create(users[1])
      await userCreated2.save();

      const userCreated3 = User.create(users[2])
      await userCreated3.save();

      /**
       * Here we have to change our test to implement a JWT and verify our implementation
       */
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

      const token = mockToken(payload)

      const getUsersQuery = gql`
      query getUsers {
        getUsers {
          firstName,
          email
        }
      }
      `
      const { data, errors } = await server.executeOperation({
        query: getUsersQuery,
      },
        { req: mockRequest(token) } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const usersInDataBase = await User.find()

      expect(data!.getUsers[0]).toStrictEqual(expect.objectContaining({
        email: usersInDataBase[0].email,
        firstName: usersInDataBase[0].firstName
      }))

      expect(data!.getUsers[1]).toStrictEqual(expect.objectContaining({
        email: usersInDataBase[1].email,
        firstName: usersInDataBase[1].firstName
      }))
    });
  })

  describe('Update Role  mutation', () => {

    const userInfos = [
      {
        firstName: "john",
        lastName: "admin",
        username: "admin",
        email: "admin@toto.td",
        password: "lennon"
      },
      {
        firstName: "antonio",
        lastName: "sanfalzar y bandales",
        username: "user",
        email: "user@toto.td",
        password: "sanfalzar y bandales"
      }
    ]

    const updateRoleMutation = gql`
      mutation updateUserRole( $data: UpdateRoleInput!) {
        updateUserRole(data: $data) {
          username
          role {
            label
          }
        }
      }`

    it('should update the role on a user if you are admin', async () => {
      const adminRole = await Role.findOne({ label: RoleName.ADMIN })
      const developerRole = await Role.findOne({ label: RoleName.DEVELOPER })


      const adminUser = User.create({ ...userInfos[0], role: adminRole });
      await adminUser.save();

      const regularUser = User.create({ ...userInfos[1] });
      await regularUser.save();


      const variables = {
        data: {
          userId: regularUser.id,
          roleId: developerRole!.id,
        }
      }

      const payload = { id: adminUser.id, username: adminUser.username, role: adminUser.role.label }

      const token = mockToken(payload)

      // !recuperer ce user directement via typeORM
      const { data, errors } = await server.executeOperation(
        {
          query: updateRoleMutation,
          variables
        },
        { req: mockRequest(token) } as ExpressContext
      )

      expect(!errors).toBeTruthy()

      const expectedResult = {
        username: regularUser.username,
        role: {
          label: RoleName.DEVELOPER
        }
      }
      expect(data!.updateUserRole).toEqual(expect.objectContaining(expectedResult));

      await User.delete({ id: adminUser.id });
      await User.delete({ id: regularUser.id });
    })

    it('should throw if you are admin', async () => {
      const developerRole = await Role.findOne({ label: RoleName.DEVELOPER })

      const developerUser = User.create({ ...userInfos[0], role: developerRole });
      await developerUser.save();

      const regularUser = User.create({ ...userInfos[1] });
      await regularUser.save();

      const payload = { id: developerUser.id, username: developerUser.username, role: developerUser.role.label }

      const token = mockToken(payload)


      const variables = {
        data: {
          userId: regularUser.id,
          roleId: developerRole!.id,
        }
      }
      // !recuperer ce user directement via typeORM
      const { errors } = await server.executeOperation({
        query: updateRoleMutation,
        variables,
      },
        { req: mockRequest(token) } as ExpressContext
      )

      expect(errors).toBeTruthy()
    })
  })

})
