import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { GraphQLError } from 'graphql'
import Task from '../../entity/Task'
import TaskInput from './TaskInput/TaskInput'
import UpdateDeleteTaskInput from './TaskInput/UpdateDeleteTaskInput'
// import {FieldResolver, Root } from "type-graphql";
// import Comment from "../../entity/Comment";

@Resolver(Task)
export default class TaskResolver {
  @Query(() => [Task])
  async getTasks(): Promise<Task[]> {
    // that's how you can Load task with their comment with left join (no n + 1 issue).
    // performance issue: even when frontend doesn't need to load the comments, we're doing a left join to fetch them anyway (Use a fieldResolver)
    const tasks = await Task.find({ relations: ['comments'] })
    return tasks
  }

  @Mutation(() => Task)
  async addTask(@Arg('data') data: TaskInput): Promise<Task> {
    const task = Task.create({ ...data })

    await task.save()

    return task
  }

  @Mutation(() => Task)
  async updateTaskbyID(
    @Arg('data') data: UpdateDeleteTaskInput
  ): Promise<Task | GraphQLError> {
    try {
      await Task.update<Task>(data.id, data)

      const updatedTask = await Task.findOne({ id: data.id })
      return updatedTask as Task
    } catch (error) {
      return new GraphQLError('update Error')
    }
  }

  @Mutation(() => Task)
  async deleTaskbyID(
    @Arg('data') data: UpdateDeleteTaskInput
  ): Promise<Task | GraphQLError> {
    try {
      const taskTodelete = await Task.findOne({ id: data.id })
      await Task.delete<Task>(data.id)
      return taskTodelete as Task
    } catch (error) {
      return new GraphQLError('update Error')
    }
  }
}
