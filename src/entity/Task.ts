import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IPostgresInterval } from 'postgres-interval';
import { Field, ID, ObjectType, Root } from 'type-graphql';


@Entity()
@ObjectType()
class Task extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Column({type: 'interval'})
  scheduled_time_interval: IPostgresInterval;

  
  @Field()
  @Column()
  advancement: number;
  
  @Field()
  @Column()
  status: string;
  
  // Field resolver (need to calculate time in hours)
  @Field(() => String)
  scheduled_time(@Root() parent: Task  ) {
    return parent.scheduled_time_interval.hours;
  }
}

export default Task;