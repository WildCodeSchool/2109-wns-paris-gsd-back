import { Field, ID, InputType } from 'type-graphql'

@InputType()
export default class AllTaskByProjectIdInput {
  @Field(() => ID)
  projectId: number

}