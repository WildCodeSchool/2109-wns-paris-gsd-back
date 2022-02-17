import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import TaskResolver from './modules/Task/Task.resolver'
import CommentResolver from './modules/Comment/Comment.resolver'
import UserResolver from './modules/User/User.resolver'
import RoleResolver from './modules/Role/Role.resolver'
import ProjectResolver from './modules/Project/Project.resolver'

async function createServer() {
  const schema = await buildSchema({
    resolvers: [TaskResolver, CommentResolver, UserResolver, RoleResolver, ProjectResolver],
  })
  // Create the GraphQL server
  const server = new ApolloServer(
    {
      schema,
      context: ({ req, res }) => ({ req, res }),
    })
  return server;
}

export default createServer
