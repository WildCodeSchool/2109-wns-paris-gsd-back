/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Field, ID, ObjectType } from 'type-graphql'

import { typeDefs as scalarTypeDefs } from 'graphql-scalars';

import Task from './Task'
import User from './User'

import DATE_TIME_TYPES from '../constants/DATE_TIME_TYPE';

export enum StatusName {
  NEW = 'NEW',
  IN_PROGRESS = 'IN PROGRESS',
  PENDING_REVIEW = 'PENDING REVIEW',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
}

@Entity()
@ObjectType()
class Project extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ type: 'text' })
  name: string

  @Field()
  @CreateDateColumn({ type: DATE_TIME_TYPES, name: 'created_at' })
  starting_time: typeDefs.DateTime

  @Field()
  @Column({ type: DATE_TIME_TYPES })
  ending_time: Date

  @Field(() => [Task])
  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[]

  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_has_projects',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[]
}

export default Project
