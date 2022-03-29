// eslint-disable-next-line max-classes-per-file
import { GraphQLError } from 'graphql'
import bcrypt from 'bcrypt'
import { sign, Secret } from 'jsonwebtoken';
import { Arg, Query, Resolver, Authorized, Mutation, ObjectType, Field } from 'type-graphql'
import User from '../../entity/User'
import Role, { RoleName } from '../../entity/Role';
import UserInput from './UserInput/UserInput';
import UpdateRoleInput from './UserInput/UpdateRoleInput';
import LoginInput from './LoginInput/LoginInput';

@ObjectType()
class LoginAnswer {
  @Field()
  token: string

}

@Resolver(User)
export default class UserResolver {
  @Query(() => LoginAnswer)

  // Handle the user login
  async loginUser(
    @Arg('data') { username, password}: LoginInput
  ): Promise<LoginAnswer | GraphQLError> {
    // we search the user who wants to log among the list of users
    const user = await User.findOne({ username }, {
      relations: ["role"]
    })
    // if user
    if (!user) {
      return new GraphQLError('Something went wrong')
    }
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return new GraphQLError('Wrong password')
    }

    const token = sign({ id: user.id, username: user.username, role: user.role.label }, process.env.JSON_TOKEN_KEY as Secret, {
      expiresIn: '24h',
    })

    return { token }
  }

  @Authorized([RoleName.ADMIN, RoleName.MANAGER])
  @Query(() => [User])
  async getUsers(): Promise<User[] | GraphQLError> {

    try {
      const users: User[] | GraphQLError = await User.find({ relations: ["role"] });

      return users

    } catch (error) {

      return new GraphQLError("y a une couille de userS")

    }
  }

  @Mutation(() => User)
  async addUser(@Arg("data") data: UserInput): Promise<User | GraphQLError> {

    try {
      const defaultRole: Role | undefined = await Role.findOne({ label: RoleName.USER })

      const user = User.create({ ...data, role: defaultRole });

      await user.save();
      return user;

    } catch (error) {
      return new GraphQLError("y a une couille de Signup")
    }
  }

  @Authorized([RoleName.ADMIN])
  @Mutation(() => User)
  async updateUserRole(
    @Arg("data") { userId, roleId }: UpdateRoleInput
  ): Promise<User | GraphQLError> {

    try {
      const user = await User.findOne({ id: userId }, { relations: ['role'] })

      if (!user) {
        return new GraphQLError('no user found')
      }

      const newRole = await Role.findOne({ id: roleId }, { relations: ['users'] })

      user.role = newRole as Role;

      await user.save();
      return user;

    } catch (error) {
      return new GraphQLError("y a une couille dans l'update user Role")
    }
  }
}

