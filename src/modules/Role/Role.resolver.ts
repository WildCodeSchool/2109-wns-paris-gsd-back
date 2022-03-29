import { ApolloError } from "apollo-server-express";
import { JwtPayload } from "jsonwebtoken";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

import Role from "../../entity/Role";
import RoleInput from "./RoleInput/RoleInput";

@Resolver(Role)
export default class RoleResolver {
  @Query(() => [Role])
  async getRoles(@Ctx() ctx: JwtPayload): Promise<Role[] | ApolloError> {
    if (ctx && ctx.payload) {
      const roles = await Role.find();
      return roles;
    }

    return new ApolloError("Not authorized")


  }

  @Mutation(() => Role)
  async addRole(@Arg("data") data: RoleInput): Promise<Role> {

    const role = Role.create({ ...data });

    await role.save();

    return role;
  }
}


// TODO Assign a role for user (should have)
