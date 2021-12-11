// eslint-disable-next-line max-classes-per-file
import { GraphQLError } from 'graphql'
import { Arg, Field, ObjectType, Query, Resolver, Mutation } from 'type-graphql'
import User from '../../entity/User'
import Role, { RoleName}  from '../../entity/Role';
import UserInput from './UserInput/UserInput';

@Resolver(User)
export default class UserResolver {
  @Query(() => [User])
  async getUsers():Promise<User[] | GraphQLError> {
    
    try {
      const users: User[] | GraphQLError = await User.find({relations: ["role"]});

      return users

    } catch (error) {
      
      return new GraphQLError("y a une couille de userS")
      
    }
  }

  @Mutation(() => User)
  async addUser(@Arg("data") data: UserInput): Promise<User | GraphQLError> {

  try {
    const defaultRole: Role | undefined = await Role.findOne({label : RoleName.USER })

    const user = User.create({...data, role: defaultRole});
  
    await user.save();
    return user;
    
  } catch (error)  {
    return new GraphQLError("y a une couille de Signup")
  }
}
}

