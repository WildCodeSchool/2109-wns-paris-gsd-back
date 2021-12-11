import { Field, InputType } from 'type-graphql'

@InputType()
export default class UserInput {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  username: string

  @Field()
  email: string

  @Field()
  password: string

}
