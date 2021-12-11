// eslint-disable-next-line max-classes-per-file
import { GraphQLError } from 'graphql'
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import User from '../../entity/User'
import LoginInput from './LoginInput/LoginInput'

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
    @Arg('data') { username, password }: LoginInput
  ): Promise<LoginAnswer | GraphQLError> {
    // we search the user who wants to log among the list of users
    const user = await User.findOne({ username })
    // if user
    if (!user) {
      return new GraphQLError('Something went wrong')
    }
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return new GraphQLError('Wrong password')
    }

    const token = sign({ id: user.id, username: user.username }, 'secretcaca', {
      expiresIn: '24h',
    })

    return {token}
  }
}
