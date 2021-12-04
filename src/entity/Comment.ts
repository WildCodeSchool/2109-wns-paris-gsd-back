import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

// eslint-disable-next-line import/no-cycle
import Task from './Task';


@Entity()
@ObjectType()
class Comment extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({type: 'text'})
    content: string;

    @Field()
    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    // I have to add the foreign key Column by hand if i want to query with find({foreignKey: number})
    @Column({name: 'task_id'})
    taskId: number;

    @Field(() => Task)
    @ManyToOne(() => Task, task => task.comments)
    @JoinColumn({name: 'task_id', referencedColumnName: 'id'})
    task: Task;

}

export default Comment;