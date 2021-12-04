/* eslint-disable import/no-cycle */
import { 
  BaseEntity,
  Column,
  CreateDateColumn, 
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';

import { Field, ID, ObjectType} from 'type-graphql';

import Comment  from './Comment'
import Project from './Project'
import User from './User'
import Asset from './Asset'

@Entity()
@ObjectType()
class Task extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({type: 'varchar'})
  title: string;

  @Field()
  @Column({type: 'text'})
  description: string;

  @Field()
  @CreateDateColumn({type: "timestamptz", name: "created_at"})
  starting_time: Date;
  
  @Field()
  @Column({type: "timestamptz"})
  ending_time: Date;

  @Field()
  @Column({type: "int"})
  advancement: number;
  
  @Field()
  @Column({type: 'varchar'})
  status: string;
  
  @Field(() => [Comment])
  @OneToMany(() => Comment, comment => comment.task)
  comments: Comment[];

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({name: 'project_id', referencedColumnName: 'id'})
  project: Project;

  @Field(() => [User])
  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  taskCreator: User;

  @Field(() => [Asset])
  @OneToMany(() => Asset, asset => asset.task)
  assets: Asset[];
}

export default Task;