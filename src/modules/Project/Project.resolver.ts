/* eslint-disable max-classes-per-file */
import { GraphQLError } from "graphql";
import { Arg, Authorized, Field, ID, Mutation, ObjectType, Query, Resolver } from "type-graphql";

import Project from "../../entity/Project";
import User from "../../entity/User";
import { RoleName } from "../../entity/Role";

import ProjectInput from "./ProjectInput/ProjectInput";
import ProjectUpdateInput from "./ProjectInput/ProjectUpdateInput";
import AddMemberToProjectInput from "./ProjectInput/AddMemberToProjectInput";


@ObjectType()
class ProjectResponse {
  @Field(() => ID)
  id: number

  @Field()
  message: string

}
@Resolver(Project)
export default class ProjectResolver {
  @Authorized()
  @Query(() => [Project])
  async getProjects(): Promise<Project[] | GraphQLError> {
    try {
      const projects: Project[] = await Project.find({ relations: ['tasks', 'tasks.taskCreator', 'tasks.taskCreator.role', 'users', 'users.role'] })
      return projects
    } catch (error) {
      return new GraphQLError('Y a une couille dans le project')
    }
  }

  @Query(() => Project)
  async getProjectById(@Arg("id") id: number): Promise<Project | undefined | GraphQLError> {
    try {
      const project = await Project.findOne({ id }, { relations: ['users', 'users.role', 'tasks', 'tasks.taskCreator', 'tasks.taskCreator.role'] })

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
    // get user to see if he has sufficient role to create
    const user = await User.findOne({ id: user_id }, { relations: ['role'] });

    if (user?.role.label !== RoleName.MANAGER) {
      return new GraphQLError("The user can't create a project");
    }

    const project = Project.create<Project>({ ...projectData, users: [user] });

    await project.save();

    return project

  }

  @Mutation(() => ProjectResponse)
  async updateProject(@Arg('data') { project_id, owner_id, ...projectData }: ProjectUpdateInput): Promise<ProjectResponse | GraphQLError> {
    // get the project
    const project = await Project.findOne({ id: project_id, }, { relations: ['users', 'users.role'] });
    if (!project) {
      return new GraphQLError('Project not found, y a une couille')
    }

    // get the owner_id 
    const projectOwner = project.users.find((user) => user.id === owner_id);

    if (!projectOwner || !(projectOwner.role.label === RoleName.MANAGER || projectOwner.role.label === RoleName.ADMIN)) {
      return new GraphQLError('user has no right to update the project , y a une couille')

    }

    await Project.update({ id: project.id }, { ...projectData });

    return {
      id: project.id,
      message: "Updated successfully"
    };

  }

  @Mutation(() => ProjectResponse)
  async addMemberToProject(@Arg('data') { projectId, managerId, memberId }: AddMemberToProjectInput): Promise<ProjectResponse | GraphQLError> {
    try {
      const project = await Project.findOneOrFail({ id: projectId }, { relations: ['users', 'users.role'] })

      const isManager = !!project.users.find(manager => manager.id === managerId && manager.role.label === RoleName.MANAGER)

      if (!isManager) {
        return new GraphQLError('You don\'t have permissions to access this one, there is a testicle')
      }

      const member = await User.findOneOrFail({ id: memberId }, { relations: ['role'] })

      const isDeveloper = member.role.label === RoleName.DEVELOPER

      if (!isDeveloper) {
        return new GraphQLError('The user isn\'t the developer you can\'t added this one, there is a testicle')
      }

      project.users.push(member)

      await project.save()

      return {
        id: projectId,
        message: "Member added successfully"
      }
    } catch (error) {
      return new GraphQLError('Y a une couille dans l\'addMemberToProject')
    }



  }

}
