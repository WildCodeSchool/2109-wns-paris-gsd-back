import { Field, ID, InputType } from 'type-graphql'

@InputType()
export default class AllTaskInput {
  @Field(() => ID)
  userId: number
}
