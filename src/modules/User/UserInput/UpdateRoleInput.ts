import { Field, InputType, ID } from 'type-graphql'

@InputType()
export default class UpdateRoleInput {
  @Field(() => ID)
  userId: number

  @Field(() => ID)
  roleId: number
}