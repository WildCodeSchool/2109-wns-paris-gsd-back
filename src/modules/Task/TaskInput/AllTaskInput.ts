import { Field, ID, InputType } from 'type-graphql'

@InputType()
export default class AllTaskInput {
  @Field(() => ID)
  projectId: number

  @Field(() => ID)
  userId: number
}
