import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import TaskResolver from './modules/Task/Task.resolver'
import CommentResolver from './modules/Comment/Comment.resolver'
import UserResolver from './modules/User/User.resolver'

async function createServer() {
  const schema = await buildSchema({
    resolvers: [TaskResolver, CommentResolver, UserResolver],
  })
  // Create the GraphQL server
  const server = new ApolloServer({ schema })
  return server
}

export default createServer
