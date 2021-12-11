/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Field, ID, ObjectType } from 'type-graphql'

import Task from './Task'
import Comment from './Comment'
import Role from './Role'

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

  @Field(() => [Task])
  @OneToMany(() => Task, (task) => task.taskCreator)
  tasks: Task[]

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[]

  @Field(() => Role)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role
}

export default User
