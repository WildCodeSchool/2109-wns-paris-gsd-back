import Project from "../../../../entity/Project";

describe('Update a project', () => {
  beforeEach(async () => {
    const project = Project.create({
      name: 'A project has to be updated',
      ending_time: new Date()
    })

    await project.save()
  });

  it('should update a project already exists', async () => {
    const projectToUpdate = await Project.update({ id: 1 }, { name: "A new name of project" })

    expect(projectToUpdate).toBeDefined()
    expect(projectToUpdate.affected).toEqual(1)
  });

  it('should no update when no project exists in db', async () => {
    const projectToUpdate = await Project.update({ id: 3 }, { name: "A new name of project" })

    expect(projectToUpdate).toBeDefined()
    expect(projectToUpdate.affected).toEqual(0)
  });
});