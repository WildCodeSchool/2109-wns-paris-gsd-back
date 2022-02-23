import { ApolloServer, gql } from 'apollo-server-express'

import createServer from '../../server'
import User from '../../entity/User'
import Role, { RoleName } from '../../entity/Role'
import Project, { StatusName } from '../../entity/Project'
import Task from '../../entity/Task'

let server: ApolloServer
let project1: Project[];
// let project2: Project;
let task1: Task;

beforeAll(async () => {
  server = await createServer()
})

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

    beforeAll(async () => {
      const managerRole = await Role.findOne({ label: RoleName.MANAGER });

      const manager = User.create({
        firstName: "RicoManager",
        lastName: "La",
        username: "ricoManager.dev",
        email: "rico.manager@wild.com",
        password: "j.lennon45",
        role: managerRole
      });

      await manager.save();

      const developerRole = await Role.findOne({ label: RoleName.DEVELOPER });

      const developer = User.create({
        firstName: "Ricodeveloper",
        lastName: "La",
        username: "ricodeveloper.dev",
        email: "rico.developer@wild.com",
        password: "j.lennon45",
        role: developerRole
      });

      await developer.save();

      const projects = [
        {
          name: "projet1",
          ending_time: new Date(),
          users: [developer, manager]
        },
        {
          name: "projet2",
          ending_time: new Date(),
          users: [manager]
        },
      ];


      project1 = Project.create(projects);
      await project1[0].save();
      await project1[1].save()
      // console.log(project1)

      // const  projet2 = Project.create({ ...projects[1] });
      // await projet2.save();

      const tasks = [
        {
          title: "tache1",
          description: "tache1 desc",
          ending_time: new Date(),
          advancement: 18,
          status: StatusName.NEW,
          // taskCreator: developer
        },
        // {
        //   title: "tache2",
        //   description: "tache2 desc",
        //   ending_time: new Date(),
        //   advancement: 18,
        //   project: projet1,
        //   taskCreator: developer

        // },
        // {
        //   title: "tache3",
        //   description: "tache3 desc",
        //   ending_time: new Date(),
        //   advancement: 18,
        //   project: projet1,
        //   taskCreator: developer

        // },
        // {
        //   title: "tache4",
        //   description: "tache4 desc",
        //   ending_time: new Date(),
        //   advancement: 36,
        //   project: projet2,
        //   taskCreator: developer

        // },
        // {
        //   title: "tache5",
        //   description: "tache5 desc",
        //   ending_time: new Date(),
        //   advancement: 75,
        //   project: projet2,
        //   taskCreator: developer

        // },
      ];

      task1 = Task.create({ ...tasks[0] })
      await task1.save();

      await Project.update({ id: project1[0].id }, { tasks: [task1] })

      // await Task.update({id: task1.id}, {...task1, project: project1[0]})
    });

    it('should retrieve an array of tasks where user has member', async () => {
      // todo  
      // [] un user developer
      // [] 2 projets => un projet dont le developer est membre
      // [] liste de taches liees aux deux projets

      // const developerRole = await Role.findOne({ label: RoleName.DEVELOPER });

      // const developer = User.create({
      //   firstName: "Rico",
      //   lastName: "La",
      //   username: "rico.dev",
      //   email: "rico.dev@wild.com",
      //   password: "j.lennon45",
      //   role: developerRole
      // });

      // await developer.save();


      // const projects = [
      //   {
      //     name: "projet1",
      //     ending_time: new Date(),
      //   },
      //   {
      //     name: "projet2",
      //     ending_time: new Date(),
      //   },
      // ];


      // const projet1 = Project.create({ ...projects[0], users: [developer] });
      // await projet1.save();
      // console.log(projet1)
      // const  projet2 = Project.create({ ...projects[1] });
      // await projet2.save();



      // const tasks = [
      //   {
      //     title: "tache1",
      //     description: "tache1 desc",
      //     ending_time: new Date(),
      //     advancement: 18,
      //     status: StatusName.NEW,
      //     taskCreator: developer
      //   },
      //   // {
      //   //   title: "tache2",
      //   //   description: "tache2 desc",
      //   //   ending_time: new Date(),
      //   //   advancement: 18,
      //   //   project: projet1,
      //   //   taskCreator: developer

      //   // },
      //   // {
      //   //   title: "tache3",
      //   //   description: "tache3 desc",
      //   //   ending_time: new Date(),
      //   //   advancement: 18,
      //   //   project: projet1,
      //   //   taskCreator: developer

      //   // },
      //   // {
      //   //   title: "tache4",
      //   //   description: "tache4 desc",
      //   //   ending_time: new Date(),
      //   //   advancement: 36,
      //   //   project: projet2,
      //   //   taskCreator: developer

      //   // },
      //   // {
      //   //   title: "tache5",
      //   //   description: "tache5 desc",
      //   //   ending_time: new Date(),
      //   //   advancement: 75,
      //   //   project: projet2,
      //   //   taskCreator: developer

      //   // },
      // ];

      // const tasks = Task.create(taskList)
      // const project_ = await Project.findOne({id: 1})

      //   const task1 = Task.create({...tasks[0]})
      //   await task1.save();

      //   await Task.update({id: task1.id}, {...task1, project: project_})

      //   console.log(task1)

      // const task2 = Task.create(tasks[1])
      // await task2.save();

      // const task3 = Task.create(tasks[2]);
      // await task3.save();

      // const task4 = Task.create(tasks[3]);
      // await task4.save();

      // const task5 = Task.create(tasks[4])
      // await task5.save();



      // const getAllTasksByUserProjectMutation = gql`
      // query getAllTasksByUserProject( $data: AllTaskInput!) {
      //   getAllTasksByUserProject(data: $data) {
      //     title,
      //     project {
      //         id,
      //         users {
      //             username
      //         }
      //     }

      //   }
      // }`;

      // const variables = {
      //   data: {
      //     userId: developer.id,
      //   }
      // }

      // const { data, errors } = await server.executeOperation({
      //   query: getAllTasksByUserProjectMutation,
      //   variables
      // });
      // console.log(errors);


      // expect(!errors).toBeTruthy();
      // console.log(data!.getAllTasksByUserProject);

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