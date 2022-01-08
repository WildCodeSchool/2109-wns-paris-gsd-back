/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Field, ID, ObjectType } from 'type-graphql'

import User from './User'

export enum RoleName {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  DEVELOPER = 'DEVELOPER',
  USER = 'USER',
}

@Entity()
@ObjectType()
class Role extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ type: 'text', default: RoleName.USER, unique: true })
  label: RoleName

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.role)
  users: User[]
}

export default Role
