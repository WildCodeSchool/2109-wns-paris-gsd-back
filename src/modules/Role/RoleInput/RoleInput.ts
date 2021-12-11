import { Field, InputType } from 'type-graphql'
import { RoleName } from '../../../entity/Role'

@InputType()
export default class RoleInput {
  @Field()
  label: RoleName
}
