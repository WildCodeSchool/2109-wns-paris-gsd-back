import Comment from '../../../entity/Comment';
import Task from '../../../entity/Task';

describe('Add Comment', () => {
  it('should return a new comment save in database', async () => {
    const task = Task.create({
      title: 'task',
      description: 'lorem ipsum sit dolor amet task',
      ending_time: new Date(),
      advancement: 15
    })

    await task.save()

    const newComment = Comment.create({
      content: 'Lorem ipsum sit dolor amet',
      taskId: (await Task.findOneOrFail({ title: 'task' })).id
    })

    await expect(newComment.save()).resolves.toBeDefined()
    await expect(newComment.save()).resolves.toBeInstanceOf(Comment)

    const comment = await Comment.findOneOrFail({ taskId: 1 })

    expect(comment.content).toEqual('Lorem ipsum sit dolor amet')

  });

  it('should rejects a add comment whitout FK constraint NOT NULL', async () => {
    const newComment = Comment.create({
      content: 'Lorem ipsum sit dolor amet',
    })

    await expect(newComment.save()).rejects.toThrowError("SqliteError: NOT NULL constraint failed: comment.task_id")
  });
});