import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

// eslint-disable-next-line import/no-cycle
import Task from './Task';

@Entity()
@ObjectType()
class Asset extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({type: 'text'})
    url: string;

    @Field(() => Task)
    @ManyToOne(() => Task, (task) => task.assets)
    @JoinColumn({name: 'task_id', referencedColumnName: 'id'})
    task: Task;
}

export default Asset;