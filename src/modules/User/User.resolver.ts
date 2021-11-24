import { GraphQLError } from 'graphql'
import { Arg, Mutation, Resolver } from 'type-graphql'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'

import User from '../../entity/User'
import LoginInput from './LoginInput/LoginInput'

@Resolver(User)
export default class UserResolver {
  @Mutation(() => User)
  async loginUser(
    @Arg('data') { username, password }: LoginInput
  ): Promise<string | GraphQLError> {
    const user = await User.findOne({ username })
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

    return token
  }
}
