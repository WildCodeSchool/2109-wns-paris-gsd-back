import { Field, InputType } from 'type-graphql'
import { StatusName } from '../../../entity/Task'

@InputType()
export default class UpdateDeleteTaskInput {
  @Field()
  id: number

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  advancement?: number

  @Field({ nullable: true })
  status?: StatusName

  @Field(() => Date, { nullable: true })
  ending_time?: Date
}
