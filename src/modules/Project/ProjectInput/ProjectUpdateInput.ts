import { Field, InputType } from 'type-graphql'

@InputType()
export default class ProjectUpdateInput {
  @Field()
  project_id: number
  
  @Field()
  name?: string

  @Field()
  ending_time?: string

  @Field()
  owner_id: number
}