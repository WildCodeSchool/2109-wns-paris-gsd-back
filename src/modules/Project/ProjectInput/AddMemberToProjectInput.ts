import { Field, InputType } from "type-graphql"

@InputType()
export default class AddMemberToProjectInput {
  @Field()
  projectId: number;

  @Field()
  memberId: number;
}