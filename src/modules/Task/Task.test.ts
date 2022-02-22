import { ApolloServer, gql } from 'apollo-server-express'

import createServer from '../../server'
import User from '../../entity/User'
import Role, { RoleName } from '../../entity/Role'
import Project from '../../entity/Project'
import Task from '../../entity/Task'

let server: ApolloServer

beforeAll(async () => {
  server = await createServer()
})

// TODO etats des lieux voir ce qui est possible de refacto
// * Un array de tasks
// * UN projet 
// * UN admin, un user, un developer

describe('Task resolver', () => {
  /**
   * QUERY
   */
  describe('Get all Tasks', () => {
    it('should retrieve an array of all tasks', async () => {
      // todo is it really necessary for now ? or email ? 
    });
  });

  describe('Get all tasks by user project', () => {
    it('should retrieve an array of tasks where user has member', async () => {
      // todo  
      // [] un user developer
      // [] 2 projets => un projet dont le developer est membre
      // [] liste de taches liees aux deux projets

      const developerRole = await Role.findOne({ label: RoleName.DEVELOPER });

      const developer = User.create({
        firstName: "Rico",
        lastName: "La",
        username: "rico.dev",
        email: "rico.dev@wild.com",
        password: "j.lennon45",
        role: developerRole
      });
      await developer.save();

      const projects = [
        {
          name: "projet1",
          ending_time: new Date(),
        },
        {
          name: "projet2",
          ending_time: new Date(),
        },
      ];

      const projet1 = Project.create({ ...projects[0], users: [developer] });
      await projet1.save();
      const projet2 = Project.create({ ...projects[1] });
      await projet2.save();

      const taskList = [
        {
          title: "tache4",
          description: "tache1 desc",
          ending_time: new Date(),
          advancement: 18,
          projectId: projet1.id,
        },
        {
          title: "tache2",
          description: "tache2 desc",
          ending_time: new Date(),
          advancement: 18,
          projectId: projet1.id,
        },
        {
          title: "tache3",
          description: "tache3 desc",
          ending_time: new Date(),
          advancement: 18,
          projectId: projet1.id,
        },
        {
          title: "tache4",
          description: "tache4 desc",
          ending_time: new Date(),
          advancement: 36,
          projectId: projet2.id,
        },
        {
          title: "tache5",
          description: "tache5 desc",
          ending_time: new Date(),
          advancement: 75,
          projectId: projet2.id,
        },
      ];

      const tasks = Task.create(taskList)

      await tasks[0].save();
      await tasks[1].save();
      await tasks[2].save();
      await tasks[3].save();
      await tasks[4].save();

      const getAllTasksByUserProjectMutation = gql`
      query getAllTasksByUserProject( $data: AllTaskInput!) {
        getAllTasksByUserProject(data: $data) {
          title,
          project {
              id,
              users {
                  username
              }
          }

        }
      }`;

      const variables = {
        data: {
          userId: developer.id,
        }
      }

      const { data, errors } = await server.executeOperation({
        query: getAllTasksByUserProjectMutation,
        variables
      });
      console.log(errors);


      expect(!errors).toBeTruthy();
      console.log(data!.getAllTasksByUserProject);

      // const taskPromise = taskList.map(task => {
      //   const newTask = new Task();

      //   // eslint-disable-next-line no-restricted-syntax
      //   for (const key of Object.keys(task)) {
      //     newTask[key] = task[key];
      //   }

      //   return newTask.save
      // });

      // const res = await Promise.all(taskPromise)

      // console.log(res);

    });
  });

  describe('Get Tasks by project id', () => {
    it('should retrieve an array of tasks by project id', async () => {

    });
  });

  describe('Get one task by id', () => {
    it('should retrieve a task by your id', async () => {

    });
  });

  /**
   * MUTATION
   */
  describe('Add a new task', () => {
    it('should retrieve a task created', async () => {

    });
  });

  describe('Update a task by your id', () => {
    it('should retrieve a task updated', async () => {

    });
  });

  describe('Change member of the task', () => {
    it('should retrieve a new member assigned on the task', async () => {

    });
  });

  describe('Deleted a task by your id', () => {
    it('should retrieve a task deleted', async () => {

    });

    it('should throw an error when a user attempts delete a task whitout granted access ', async () => {

    });
  });
})