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

import Task from './Task'
import User from './User'

@Entity()
@ObjectType()
class Project extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ type: 'text', default: 'To do' })
  status: string

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  starting_time: Date

  @Field()
  @Column({ type: 'timestamptz' })
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
