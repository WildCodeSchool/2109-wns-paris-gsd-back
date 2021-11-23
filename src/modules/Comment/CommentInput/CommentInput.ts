import { Field, ID, InputType } from "type-graphql";

@InputType()
export default class CommentInput {
    @Field()
    content: string;

    @Field(() => ID)
    taskId: number;
}