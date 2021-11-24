import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { Field, ID, ObjectType } from 'type-graphql'

@Entity()
@ObjectType()
class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ type: 'text' })
  firstName: string

  @Field()
  @Column({ type: 'text' })
  lastName: string

  @Field()
  @Column({ type: 'text', unique: true })
  username: string

  @Field()
  @Column({ type: 'text', unique: true })
  email: string

  @Field()
  @Column({ type: 'text' })
  password: string
}

export default User
