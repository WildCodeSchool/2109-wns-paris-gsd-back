import { ApolloError } from "apollo-server-express";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";

import Role, { RoleName } from "../../entity/Role";
import RoleInput from "./RoleInput/RoleInput";

@Resolver(Role)
export default class RoleResolver {

  @Authorized([RoleName.ADMIN, RoleName.MANAGER])
  @Query(() => [Role])
  async getRoles(): Promise<Role[] | ApolloError> {

    const roles = await Role.find();
    return roles;

  }

  @Authorized([RoleName.ADMIN])
  @Mutation(() => Role)
  async addRole(@Arg("data") data: RoleInput): Promise<Role> {
    const role = Role.create({ ...data });

    await role.save();

    return role;
  }
}


// TODO Assign a role for user (should have)
