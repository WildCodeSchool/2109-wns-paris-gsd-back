import { ApolloServer, gql } from 'apollo-server-express'
import bcrypt from 'bcrypt'

import createServer from '../../server'
import User from '../../entity/User'

let server: ApolloServer

beforeAll(async () => {
  server = await createServer()
})

describe('login resolver', () => {
  describe('loginUser mutation', () => {
    it('logs a user and return a valid json Token', async () => {
      const user = await User.create({
        username: 'toto',
        email: 'toto@toto.com',
        firstName: 'toto',
        lastName: 'toto',
        password: await bcrypt.hash('toto', 10),
      })

      await user.save()

      const loginUserQuery = gql`
        query LoginUser($data: LoginInput!) {
          loginUser(data: $data) {
            token
          }
        }
      `

      const variables = { data: { username: 'toto', password: 'toto' } }

      const { data, errors } = await server.executeOperation({
        query: loginUserQuery,
        variables,
      });

      expect(!errors && data!.loginUser.token).toBeTruthy()
    })
  })
})
