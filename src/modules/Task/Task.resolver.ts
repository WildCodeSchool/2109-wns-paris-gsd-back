import { Arg, Mutation, Query, Resolver } from "type-graphql";

import Task from "../../entity/Task";
import TaskInput from "./TaskInput/TaskInput";

// import {FieldResolver, Root } from "type-graphql";
// import Comment from "../../entity/Comment";


@Resolver(Task)
export default class TaskResolver {
    // If we dont make the join on the comment table to query for all tasks, we can use a fieldResolver
    // it will be called automatically if the frontend query on comments, but if we query for multiple tasks, we have the n + 1 problem

    // @FieldResolver()
    // async comments(@Root() parent: Task): Promise<Comment[]> {
    //     const comments = await Comment.find({taskId: parent.id})
    //     return comments;
    // }

    @Query(() => [Task])
    async getTasks(): Promise<Task[]> {
        // that's how you can Load task with their comment with left join (no n + 1 issue).
        // performance issue: even when frontend doesn't need to load the comments, we're doing a left join to fetch them anyway (Use a fieldResolver)
        const tasks = await Task.find({relations: ["comments"]});
        return tasks;
    }  

     @Mutation(() => Task)
     async addTask(@Arg("data") data: TaskInput): Promise<Task> {
        
        const task = Task.create({...data});

        await task.save();

        return task;
     }

}