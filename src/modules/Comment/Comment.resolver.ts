import { Arg, Mutation, Resolver } from "type-graphql";
import CommentInput from "./CommentInput/CommentInput";

import Task from "../../entity/Task";
import Comment from "../../entity/Comment";

@Resolver(Comment)
export default class CommentResolver {
    @Mutation(() => Comment)
    async addComment(@Arg("data") {taskId, content}: CommentInput): Promise<Comment> {
        const task = await Task.findOne(taskId);

        const newComment = Comment.create({content});
        newComment.task = task as Task;

        await newComment.save();

        return newComment;
    }
}