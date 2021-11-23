import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IPostgresInterval } from 'postgres-interval';
import { Field, ID, ObjectType, Root } from 'type-graphql';
// eslint-disable-next-line import/no-cycle
import Comment from './Comment';


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

  @Column({name:"scheduled_time_interval", type: 'interval'})
  scheduledTimeInterval: IPostgresInterval;

  
  @Field()
  @Column({type: "int"})
  advancement: number;
  
  @Field()
  @Column({type: 'varchar'})
  status: string;
  
  // Field resolver (need to calculate time in hours)
  @Field(() => String)
  scheduled_time(@Root() parent: Task ): string {
   
    // return `${parent.scheduledTimeInterval.hours}`;
   
    return parent.scheduledTimeInterval.toPostgres();

  }

  @Field(() => [Comment])
  @OneToMany(() => Comment, comment => comment.task)
  comments: Comment[];

}

export default Task;