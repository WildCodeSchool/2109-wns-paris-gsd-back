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

import ENUM_DATA_TYPE from '../constants/ENUM_DATA_TYPE';

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
  @Column({ type: ENUM_DATA_TYPE, enum: ENUM_DATA_TYPE === 'enum' ? RoleName : undefined,  default: RoleName.USER, unique: true })
  label: RoleName

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.role)
  users: User[]
}

export default Role

// type: "enum",
// enum: UserRole,
// default: UserRole.GHOST