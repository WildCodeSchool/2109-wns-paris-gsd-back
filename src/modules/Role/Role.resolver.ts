import { Arg, Mutation, Query, Resolver } from "type-graphql";

import Role from "../../entity/Role";
import RoleInput from "./RoleInput/RoleInput";

@Resolver(Role)
export default class RoleResolver {
  @Query(() => [Role])
  async getRoles(): Promise<Role[]> {
    
    const roles = await Role.find();
    return roles;
  }  

  @Mutation(() => Role)
  async addRole(@Arg("data") data: RoleInput): Promise<Role> {
    
    const role = Role.create({...data});

    await role.save();

    return role;
  }
}

