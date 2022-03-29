import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import { buildSchema } from 'type-graphql'
import customAuthChecker from './utils/authChecker'
import TaskResolver from './modules/Task/Task.resolver'
import UserResolver from './modules/User/User.resolver'
import CommentResolver from './modules/Comment/Comment.resolver'
import RoleResolver from './modules/Role/Role.resolver'
import ProjectResolver from './modules/Project/Project.resolver'


dotenv.config()

async function createServer() {
  const schema = await buildSchema({
    resolvers: [TaskResolver, CommentResolver, UserResolver, RoleResolver, ProjectResolver],
    authChecker: customAuthChecker
  })
  // Create the GraphQL server
  const server = new ApolloServer(
    {
      schema,
      context: ({ req }) => (
        {
          token: req.headers.authorization,
          payload: null
        }
      )

    })
  return server;
}

export default createServer
