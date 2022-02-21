import { Field, ID, InputType } from 'type-graphql'

@InputType()
export default class TaskIdInput {
  @Field(() => ID)
  taskId: number
}