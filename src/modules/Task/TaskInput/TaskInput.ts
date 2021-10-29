import { IPostgresInterval } from "postgres-interval";
import { Field, InputType } from "type-graphql";

@InputType()
export default class TaskInput {
    @Field()
    title: string;
  
    @Field()
    description: string;

    @Field(() => String)
    scheduled_time_interval: IPostgresInterval;
  
    
    @Field()
    advancement: number;
    
    @Field()
    status: string;
}