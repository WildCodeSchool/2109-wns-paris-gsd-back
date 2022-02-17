import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { GraphQLError } from 'graphql'
import User from '../../entity/User';
import Task from '../../entity/Task'
import TaskInput from './TaskInput/TaskInput'
import UpdateDeleteTaskInput from './TaskInput/UpdateDeleteTaskInput'
import ChangeAssigneeInput from './TaskInput/ChangeAssigneeInput';
// import {FieldResolver, Root } from "type-graphql";
// import Comment from "../../entity/Comment";

@Resolver(Task)
export default class TaskResolver {
  @Query(() => [Task])
  async getTasks(): Promise<Task[]> {
    // that's how you can Load task with their comment with left join (no n + 1 issue).
    // performance issue: even when frontend doesn't need to load the comments, we're doing a left join to fetch them anyway (Use a fieldResolver)
    const tasks = await Task.find({ relations: ['comments', "taskCreator", 'taskCreator.role'], })
    return tasks
  }

  @Mutation(() => Task)
  async addTask(@Arg('data') {creator_id, ...taskData}: TaskInput): Promise<Task> {
    
    const user = await User.findOne({id: creator_id});

    const task = Task.create({ ...taskData, taskCreator: user });

    await task.save()

    return task
  }

  @Mutation(() => Task)
  async updateTaskbyId(
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
  async changeAssignee(
    @Arg('data') data: ChangeAssigneeInput
  ) : Promise<Task | GraphQLError> {
    try {
      const task = await Task.findOne({id: data.id}) as Task;
      const newAssignee  = await User.findOne({id: data.creator_id}, {relations : ["role"]}) as User;

      task.taskCreator = newAssignee;
      task.save();

      return task;

    } catch (error) {
      return new GraphQLError('new assignee error')

    }
  }

  @Mutation(() => Task)
  async deleteTaskbyId(
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
