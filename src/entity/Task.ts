/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm'

import { Field, ID, ObjectType, Root } from 'type-graphql'

import ENUM_DATA_TYPE from '../constants/ENUM_DATA_TYPE'

import Comment from './Comment'
import Project from './Project'
import User from './User'
import Asset from './Asset'

export enum StatusName {
  NEW = 'NEW',
  IN_PROGRESS = 'IN PROGRESS',
  PENDING_REVIEW = 'PENDING REVIEW',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
}

// registerEnumType(StatusName, {
//   name: "StatusName", // this one is mandatory
//   description: "name of status", // this one is optional
// });

@Entity()
@ObjectType()
class Task extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ type: 'varchar' })
  title: string

  @Field()
  @Column({ type: 'text' })
  description: string

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  starting_time: Date

  @Field(() => String)
  @Column()
  ending_time: Date

  @Field(() => Number, { nullable: true })
  estimated_time(@Root() task: Task) {
    const begin: Date = new Date(task.starting_time)
    const end: Date = new Date(task.ending_time)

    const estimee = Math.round(
      (end.getTime() - begin.getTime()) / 1000 / 3600
    )

    return estimee
  }

  @Field()
  @Column({ type: 'int' })
  advancement: number

  @Field()
  @Column({
    type: ENUM_DATA_TYPE,
    enum: ENUM_DATA_TYPE === 'enum' ? StatusName : undefined,
    default: StatusName.NEW,
  })
  status: StatusName

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[]

  @Field(() => Project, { nullable: true })
  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project

  //! maybe change name of taskCreator by assignee / smthg else
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  taskCreator: User

  @Field(() => [Asset])
  @OneToMany(() => Asset, (asset) => asset.task)
  assets: Asset[]
}

export default Task
