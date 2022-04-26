import { ApolloServer, ExpressContext, gql } from 'apollo-server-express'
import { mockRequest } from '../../test/setup';
import createServer from '../../server';
import Task from '../../entity/Task';

let server: ApolloServer


beforeAll(async () => {
  server = await createServer()
})

describe('Comment Resolver', () => {
  describe('Add new comments', () => {
    it('should retrieve a new comment added', async () => {

      const task = Task.create({
        title: "titre tache",
        description: "description tache",
        ending_time: new Date(),
        advancement: 0,
      })

      await task.save();

      const addCommentMutation = gql`
      mutation AddComment($data: CommentInput!) {
        addComment(data: $data) {
          id
          content,
        }
      }
      `
      const variables = {
        data: {
          content: 'Lorem ipsum dolor sit amet',
          taskId: task.id
        }
      }

      const { data, errors } = await server.executeOperation({
        query: addCommentMutation,
        variables
      },
        { req: mockRequest() } as ExpressContext
      )


      expect(!errors).toBeTruthy()

      const expectedResult = await Task.findOne({ id: task.id }, { relations: ["comments"] })

      expect(data!.addComment.content).toEqual(expectedResult?.comments[0].content);


    })

  })
})