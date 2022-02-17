import { GraphQLError } from "graphql";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import Project from "../../entity/Project";
import User from "../../entity/User";
import { RoleName } from "../../entity/Role";

import ProjectInput from "./ProjectInput/ProjectInput";

@Resolver(Project)
export default class ProjectResolver {
  @Query(() => [Project])
  async getProjects(): Promise<Project[] | GraphQLError> {
    try {
      const projects: Project[] = await Project.find({ relations: ['tasks', 'users'] })
      return projects
    } catch (error) {
      return new GraphQLError('Y a une couille dans le project')
    }
  }

  @Query(() => Project)
  async getProjectById(@Arg("id") id: number): Promise<Project | undefined | GraphQLError> {
    try {
      const project = await Project.findOne({ id })

      if (!project) {
        return new GraphQLError('Y a une couille dans le project qui existe pas')
      }

      return project;

    } catch (error) {
      return new GraphQLError('Y a une couille dans le project')
    }
  }

  @Mutation(() => Project)
  async addProject(@Arg('data') { user_id, ...projectData }: ProjectInput): Promise<Project | GraphQLError> {
    // TODO create a project

    // get user to see if he has sufficient role to create
    const user = await User.findOne({ id: user_id });

    if (user?.role.label !== RoleName.MANAGER) {
      return new GraphQLError("The user can't create a project");
    }

    const project = Project.create<Project>({ ...projectData, users: [user] });

    await project.save();

    return project

  }
}
