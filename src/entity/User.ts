import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Field, ID, ObjectType } from 'type-graphql'

// eslint-disable-next-line import/no-cycle
import Task from './Task';


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
  @OneToMany(() => Task, task => task.taskCreator)
  tasks: Task[];
}

export default User
