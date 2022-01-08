import { Field, InputType } from 'type-graphql';

@InputType()
export default class ChangeAssigneeInput {
  @Field()
  id: number

  @Field()
  creator_id: number
}
