/* eslint-disable max-classes-per-file */
import { Arg, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { GraphQLError } from 'graphql'
import { RoleName } from '../../entity/Role';
import User from '../../entity/User';
import Task from '../../entity/Task'
import TaskInput from './TaskInput/TaskInput'
import UpdateDeleteTaskInput from './TaskInput/UpdateDeleteTaskInput'
import ChangeAssigneeInput from './TaskInput/ChangeAssigneeInput';
import AllTaskInput from './TaskInput/AllTaskInput';
import AllTaskByProjectIdInput from './TaskInput/AllTaskByProjectIdInput';
import TaskIdInput from './TaskInput/TaskIdInput';
import Project from '../../entity/Project';

@ObjectType()
class UpdateTaskResponse {
  @Field(() => ID)
  id: number

  @Field()
  message: string

}
@Resolver(Task)
export default class TaskResolver {

  /*
  **  QUERY
  */

  @Query(() => [Task])
  async getTasks(): Promise<Task[]> {
    // that's how you can Load task with their comment with left join (no n + 1 issue).
    // performance issue: even when frontend doesn't need to load the comments, we're doing a left join to fetch them anyway (Use a fieldResolver)
    const tasks = await Task.find({ relations: ['comments', "comments.author", "taskCreator", 'taskCreator.role'] })
    return tasks
  }

  @Query(() => [Task])
  async getAllTasksByUserProject(@Arg('data') {userId}: AllTaskInput): Promise<Task[] | GraphQLError> {
    
    try {
      
      const tasks = await Task.find({relations: ["project", "project.users", "taskCreator"] });
      
      // will get all tasks from all project the user is a member from
      return tasks.filter((task => task.project.users.find(( user ) => +user.id === +userId )));

    } catch (error) {

      return new GraphQLError("y a une couille dans getAllTasksByUserProject");
    }
    
  }

  @Query(() => [Task])
  async getTasksByProjectId(@Arg('data') {projectId}: AllTaskByProjectIdInput): Promise<Task[] | GraphQLError> {
    try {
      const tasks = await Task.find({relations: ["project"]})
      
      return tasks.filter((task) => task.project.id === projectId)

    } catch (error) {
      
      return new GraphQLError(" y a une couille dans getTasksByProjectId")
    }
  }

  @Query(() => [Task])
  async getTaskById(@Arg('data') {taskId}: TaskIdInput): Promise<Task | GraphQLError> {
    try {
      const task = await Task.findOneOrFail({id: taskId}, {relations: ["project", "comments", "comments.author", "comments.author.role", "taskCreator", "taskCreator.role"]})
     
      return task;

    } catch (error) {
      
      return new GraphQLError(" y a une couille dans getTaskById")
    }
  }

  /*
  **  MUTATION
  */

  @Mutation(() => Task)
  async addTask(@Arg('data') {creatorId, projectId, ...taskData }: TaskInput): Promise<Task | GraphQLError> {
    
    try {
      const user = await User.findOneOrFail({id: creatorId});

      const project = await Project.findOneOrFail({id:projectId}, {relations: ['users']});
      
      const isMember = !!project?.users.find(currentUser => user.id === currentUser.id)
      
      if (!isMember) {
        return new GraphQLError("user is not authorized to add a task, y a une couille")
      }

      const task = Task.create({ ...taskData, taskCreator: user, project });
      await task.save()
      
      return task;
      
    } catch (error) {
      return new GraphQLError('y a une couille dans l\'addTask')
    }
  }

  @Mutation(() => Task)
  async updateTaskbyId(
    @Arg('userId') userId: number,
    @Arg('data') data: UpdateDeleteTaskInput
  ): Promise<UpdateTaskResponse | GraphQLError> {
    try {
      const taskToUpdate = await Task.findOneOrFail({ id: data.id }, {relations: ["project", "project.users"]})

      // making sure that the user is member of the project before updating
      const user = await User.findOneOrFail({id: userId});
      const isMember = !!taskToUpdate.project.users.find(currentUser => user.id === currentUser.id)
      
      if (!isMember) {
        return new GraphQLError("user is not authorized to update a task, y a une couille")
      }

      await Task.update({id: taskToUpdate.id}, {...data});

      return {
        id: taskToUpdate.id,
        message: "Updated successfully"
      }
  
    } catch (error) {
      return new GraphQLError('update Error')
    }
  }

  @Mutation(() => Task)
  async changeAssignee(
    @Arg('userId') userId: number,
    @Arg('data') data: ChangeAssigneeInput
  ) : Promise<Task | GraphQLError> {
    try {
      const task = await Task.findOneOrFail({id: data.id}, {relations: ["project", "project.users"]});
      // make sure that the guy trying to change assignee

      const isUserMember = !!task.project.users.find((user) => user.id === userId);

      if (!isUserMember) {
        return new GraphQLError("User can't change assignee, y a une couille");
      }

      const newAssignee  = await User.findOneOrFail({id: data.creator_id}, {relations : ["role"]});

      const isAssigneeMember = !!task.project.users.find((user) => user.id === data.creator_id);

      if (!isAssigneeMember) {
        return new GraphQLError("User can't be assigned to this project, y a une couille");
      }

      task.taskCreator = newAssignee;
      task.save();

      return task;

    } catch (error) {
      return new GraphQLError('new assignee error')

    }
  }

  @Mutation(() => Task)
  async deleteTaskbyId(
    @Arg('userId') userId: number,
    @Arg('data') data: UpdateDeleteTaskInput
  ): Promise<Task | GraphQLError> {
    try { 
      const taskTodelete = await Task.findOneOrFail({ id: data.id }, {relations: ["project", "project.users", 'project.users.role']})

      const manager = taskTodelete.project.users.find(user => user.role.label === RoleName.MANAGER)
      
      if (!manager || manager.id !== userId) {
        return new GraphQLError("can't delete the task, you are not the manager")
      }

      await Task.delete(data.id)
      return taskTodelete

    } catch (error) {
      return new GraphQLError('delete Error')
    }
  }
}
