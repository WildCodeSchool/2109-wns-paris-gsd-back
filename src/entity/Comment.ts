/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'

import Task from './Task'
import User from './User'

import DATE_TIME_TYPES from '../constants/DATE_TIME_TYPE';

console.log(process.env.JEST)
@Entity()
@ObjectType()
class Comment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ type: 'text' })
  content: string

  @Field()
  @CreateDateColumn({ type: DATE_TIME_TYPES, name: 'created_at' })
  createdAt: Date

  // I have to add the foreign key Column by hand if i want to query with find({foreignKey: number})
  @Column({ name: 'task_id' })
  taskId: number

  @Field(() => Task)
  @ManyToOne(() => Task, (task) => task.comments)
  @JoinColumn({ name: 'task_id', referencedColumnName: 'id' })
  task: Task

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  author: User
}

export default Comment
