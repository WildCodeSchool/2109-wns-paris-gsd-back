/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { config } from "dotenv";
import bcrypt from 'bcrypt'
import { connectPostgres } from "../createConnection";
import "reflect-metadata";
// import { createConnection, getConnectionOptions } from "typeorm";
import User from '../entity/User'
import Role, { RoleName } from "../entity/Role";
import Task, { StatusName } from "../entity/Task";
import Project from "../entity/Project";
// import Comment from "../entity/Comment";

config({ path: `.env.${process.env.NODE_ENV}` });

console.log(`seedDatabase starting in ${process.env.NODE_ENV} environment`);

const usersName = [
  {
    firstName: "Mathildad",
    lastName: "Test",
    email: "Mathildad@gmail.com",
  },
  {
    firstName: "Valentaing",
    lastName: "Test",
    email: "Valentaing@gmail.com",
  },
  {
    firstName: "Ricolas",
    lastName: "Test",
    email: "ricolas@gmail.com",
  },
  {
    firstName: "Camillodo",
    lastName: "Test",
    email: "Camillodo@gmail.com",
  },
  {
    firstName: "Yasmine",
    lastName: "Test",
    email: "Yasmine@gmail.com",
  },
  {
    firstName: "Soba",
    lastName: "Girl",
    email: "sobagirl@gmail.com",
  },
];

const projectName = [
  {
    title: "Test-proyait",
    description: "Lorem ipsum sit amet dolor my testcile",
  },
  {
    title: "Test-proyait-2",
    description: "Je suis une fougere, vive typeOrm",
  },
  {
    title: "Test-proyait-Test",
    description: "fdsklfjdslkfjdsklj You are special",
  },
];

/**
 * Seeding DATABASE
 */



const seedingDB = async () => {
  // const connectionOptions = await getConnectionOptions(process.env.DB_NAME);

  connectPostgres()
    .then(async (connection) => {
      // DELETING DB
      console.log("deleting previous DB ...");
      await connection.dropDatabase();
      console.log("deleting previous DB ...Done");
      console.log("synchronizing new DB...");
      await connection.synchronize();
      console.log("synchronizing new DB...Done");

      /**
       * ? CREATE ROLES"
       */
      console.log("CREATE ROLES");
      for (const curLabel of Object.values(RoleName)) {
        const role = new Role();
        role.label = curLabel;
        await connection.manager.save(role);
        console.log(`Saved a : ${role.label}`);
      }

      //!  ROLE USER
      const defaultRole = await Role.findOne({ id: 3 });
      const managerRole = await Role.findOne({ id: 1 });

      /**
       * ? CREATE USERS
       */
      console.log("CREATE USERS");
      for (const user of usersName) {
        const u = new User();
        u.firstName = user.firstName;
        u.lastName = user.lastName;
        u.username = `${user.firstName}${user.lastName}`;
        u.email = user.email;
        u.password = bcrypt.hashSync("azerty123", 10);
        const userInstance = await connection.manager.save(u);

        if (u.firstName === 'Valentaing') {
          await User.update({ id: userInstance.id }, { ...userInstance, role: managerRole })
        } else {
          await User.update({ id: userInstance.id }, { ...userInstance, role: defaultRole })
        }

        console.log(`Saved a new user with named:  + ${u.firstName}`);
      }
      const users = await connection.manager.find(User, { relations: ['role'] });


      // ? CREATE PROJECTS
      console.log("CREATE PROJECTS");
      for (const project of projectName) {
        const p = new Project();
        p.name = project.title;
        p.ending_time = new Date();
        p.users = project !== projectName[2] ? users : [];
        await connection.manager.save(p);
        console.log(`Saved a new project with named: ${p.name}`);
      }
      const projects = await connection.manager.find(Project, { relations: ["users"] });
      console.log(projects)

      // CREATE TASKS
      console.log("CREATE TASKS");
      for (const project of projects) {
        if (project.users.length) {
          for (let index = 0; index < 5; index += 1) {
            const t = new Task();
            t.title = `task title ${index}`;
            t.description = `task description ${index}`;
            t.project = project;
            if (index === 0) {
              t.status = StatusName.DONE;
            }
            if (project.users.length)
              t.taskCreator = project.users[Math.floor(Math.random() * project.users.length)];
            t.ending_time = new Date();
            t.advancement = Math.floor(Math.random() * 100)

            await connection.manager.save(t);

            console.log(
              `Saved a new Task: ${t.title}. On project id: ${project.id}`
            );
          }
        }
      }
      console.log(await connection.manager.find(Task, { relations: ["project", "project.users", "taskCreator"] }))
      console.log("database seeded. 🚀");
    })
    .catch((error) => console.log(error));
};

seedingDB();