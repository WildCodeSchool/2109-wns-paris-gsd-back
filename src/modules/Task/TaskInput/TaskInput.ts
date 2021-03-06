import { Field, ID, InputType } from 'type-graphql'
import { StatusName } from '../../../entity/Task'

@InputType()
export default class TaskInput {
  @Field()
  title: string

  @Field()
  description: string

  @Field()
  advancement: number

  @Field()
  status: StatusName

  @Field(() => String)
  ending_time: Date

  @Field(() => ID)
  projectId: number
}
