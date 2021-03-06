// eslint-disable-next-line max-classes-per-file
import { GraphQLError } from 'graphql'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { sign, Secret } from 'jsonwebtoken';
import { Arg, Query, Resolver, Authorized, Mutation, ObjectType, Field, Ctx } from 'type-graphql'
import User from '../../entity/User'
import Role, { RoleName } from '../../entity/Role';
import UserInput from './UserInput/UserInput';
import UpdateRoleInput from './UserInput/UpdateRoleInput';
import LoginInput from './LoginInput/LoginInput';

@ObjectType()
class LoginAnswer {
  @Field()
  username: string;

  @Field()
  role: Role;

  @Field()
  userId: number;

  @Field()
  isConnected: boolean;

  @Field()
  token: string;
}

@Resolver(User)
export default class UserResolver {
  @Query(() => LoginAnswer)
  async loginUser(
    @Arg('data') { username, password }: LoginInput,
    @Ctx() context: { req: Request, res: Response }
  ): Promise<LoginAnswer | GraphQLError> {
    // we search the user who wants to log among the list of users
    const user = await User.findOne({ username }, {
      relations: ["role"]
    })

    if (!user) {
      return new GraphQLError('Something went wrong')
    }
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return new GraphQLError('Wrong password')
    }

    const token = sign({ id: user.id, username: user.username, role: user.role }, process.env.JSON_TOKEN_KEY as Secret, {
      expiresIn: '24h',
    })

    const options = {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true, // cookie is only accessible by the server
      secure: true,

      sameSite: "none" as "none", // only sent for requests to the same FQDN as the domain in the cookie
    }

    context.res.cookie('token', token, options);

    return { userId: user.id, username: user.username, role: user.role, isConnected: true, token }
  }

  @Authorized([RoleName.ADMIN, RoleName.MANAGER])
  @Query(() => [User])
  async getUsers(): Promise<User[] | GraphQLError> {

    try {
      const users: User[] | GraphQLError = await User.find({ relations: ["role"] });

      return users

    } catch (error) {

      return new GraphQLError("Something errors occurs in getUsers")

    }
  }

  @Mutation(() => User)
  async addUser(@Arg("data") data: UserInput): Promise<User | GraphQLError> {

    try {
      const defaultRole: Role | undefined = await Role.findOne({ label: RoleName.USER })

      const password = bcrypt.hashSync(data.password, 10)

      const user = User.create({ ...data, password, role: defaultRole });

      await user.save();
      return user;

    } catch (error) {
      return new GraphQLError("Something errors occurs in addUsers")
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
      return new GraphQLError("Something errors occurs in update user Role")
    }
  }
}
