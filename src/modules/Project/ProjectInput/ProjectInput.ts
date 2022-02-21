import { Field, InputType } from 'type-graphql'

@InputType()
export default class ProjectInput {
  @Field()
  name: string

  @Field()
  ending_time: Date

  @Field()
  user_id: number
}