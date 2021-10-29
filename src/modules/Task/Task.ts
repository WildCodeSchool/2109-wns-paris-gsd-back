import { Arg, Mutation, Query, Resolver } from "type-graphql";

import Task from "../../entity/Task";
import TaskInput from "./TaskInput/TaskInput";


@Resolver(Task)
export default class TaskResolver {
    @Query(() => [Task])
    async getTasks() {
        const tasks = await Task.find();
        
        return tasks;
    }  

     @Mutation(() => Task)
     async addTask(@Arg("data") data: TaskInput): Promise<Task> {
        const task = Task.create(data);

        await task.save();

        return task;
     }

}