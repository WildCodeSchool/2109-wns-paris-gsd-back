import { Field, InputType } from "type-graphql";

@InputType()
export default class TaskInput {
    @Field()
    title: string;
  
    @Field()
    description: string;

    @Field(() => String)
    scheduledTimeInterval: string;
  
    
    @Field()
    advancement: number;
    
    @Field()
    status: string;
}