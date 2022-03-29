import { ApolloServer } from 'apollo-server-express'
import jwt, { JsonWebTokenError, JwtPayload, Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { buildSchema } from 'type-graphql'
import TaskResolver from './modules/Task/Task.resolver'
import UserResolver from './modules/User/User.resolver'
import CommentResolver from './modules/Comment/Comment.resolver'
import RoleResolver from './modules/Role/Role.resolver'
import ProjectResolver from './modules/Project/Project.resolver'

dotenv.config()

async function createServer() {
  const schema = await buildSchema({
    resolvers: [TaskResolver, CommentResolver, UserResolver, RoleResolver, ProjectResolver],
  })
  // Create the GraphQL server
  const server = new ApolloServer(
    {
      schema,
      context: ({ req }) => {
        const token = req.headers.authorization;

        if (token) {
          let payload: JwtPayload;
          try {
            payload = jwt.verify(token, process.env.JSON_TOKEN_KEY as Secret) as JwtPayload;
            return { payload };
          } catch (err) {
            throw new JsonWebTokenError("Invalid Token");

          }
        } else {
          return {}
        }
      },
    })
  return server;
}

export default createServer
