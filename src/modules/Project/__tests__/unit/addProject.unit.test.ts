import Project from "../../../../entity/Project";

describe('Add a new project', () => {
  it('should add a new project in db', async () => {
    const addProject = Project.create({
      name: "Add new project",
      ending_time: new Date()
    })
    await expect(addProject.save()).resolves.toBeDefined()
    await expect(addProject.save()).resolves.toBeInstanceOf(Project)
  });

  it('should should rejects when NOT NULL constraint failed: project.ending_time', async () => {
    const addProject = Project.create({
      name: 'Test add Project'
    })
    await expect(addProject.save()).rejects.toThrowError('SqliteError: NOT NULL constraint failed: project.ending_time')
  });
});