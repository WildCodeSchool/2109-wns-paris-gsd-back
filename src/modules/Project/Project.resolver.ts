/* eslint-disable max-classes-per-file */
import { GraphQLError } from "graphql";
import { Arg, Authorized, Field, ID, Mutation, ObjectType, Query, Resolver, Ctx } from "type-graphql";
import { JwtPayload } from 'jsonwebtoken'
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
  @Authorized([RoleName.ADMIN, RoleName.MANAGER])
  @Query(() => [Project])
  async getProjects(): Promise<Project[] | GraphQLError> {
    try {
      const projects: Project[] = await Project.find({ relations: ['tasks', 'tasks.taskCreator', 'tasks.taskCreator.role', 'users', 'users.role'] })
      return projects
    } catch (error) {
      return new GraphQLError('Y a une couille dans le project')
    }
  }

  @Authorized([RoleName.ADMIN, RoleName.MANAGER, RoleName.DEVELOPER])
  @Query(() => Project)
  async getProjectById(
    @Arg("id") id: number,
    @Ctx() context: { payload: JwtPayload },

  ): Promise<Project | undefined | GraphQLError> {
    try {
      const project = await Project.findOne({ id }, { relations: ['users', 'users.role', 'tasks', 'tasks.taskCreator', 'tasks.taskCreator.role'] })

      if (!project) {
        return new GraphQLError('Y a une couille dans le project qui existe pas')
      }

      const isUserMember = !project.users.find(
        (user) => user.id === context.payload.id || context.payload.role === RoleName.ADMIN
      )

      if (!isUserMember) {
        return new GraphQLError("User can't change assignee, y a une couille")
      }

      return project;

    } catch (error) {
      return new GraphQLError('Y a une couille dans le project')
    }
  }

  @Authorized([RoleName.ADMIN, RoleName.MANAGER])
  @Mutation(() => Project)
  async addProject(
    @Arg('data') { ...projectData }: ProjectInput,
    @Ctx() context: { payload: JwtPayload })
    : Promise<Project | GraphQLError> {
    // get user to see if he has sufficient role to create
    const user = await User.findOne({ id: context.payload.id }, { relations: ['role'] });

    if (user?.role.label !== RoleName.MANAGER) {
      return new GraphQLError("The user can't create a project");
    }

    const project = Project.create<Project>({ ...projectData, users: [user] });

    await project.save();

    return project

  }

  @Authorized([RoleName.ADMIN, RoleName.MANAGER])
  @Mutation(() => ProjectResponse)
  async updateProject(
    @Arg('data') { project_id, ...projectData }: ProjectUpdateInput,
    @Ctx() context: { payload: JwtPayload })
    : Promise<ProjectResponse | GraphQLError> {
    // get the project
    const project = await Project.findOne({ id: project_id, }, { relations: ['users', 'users.role'] });
    if (!project) {
      return new GraphQLError('Project not found, y a une couille')
    }

    // get the owner_id 
    const projectOwner = project.users.find((user) => user.id === context.payload.id);

    console.log(projectOwner)

    if (!projectOwner) {
      return new GraphQLError('user has no right to update the project , y a une couille')

    }

    await Project.update({ id: project.id }, { ...projectData });

    return {
      id: project.id,
      message: "Updated successfully"
    };

  }

  @Authorized([RoleName.ADMIN, RoleName.MANAGER])
  @Mutation(() => ProjectResponse)
  async addMemberToProject(
    @Arg('data') { projectId, memberId }: AddMemberToProjectInput,
    @Ctx() context: { payload: JwtPayload }
  )
    : Promise<ProjectResponse | GraphQLError> {
    try {
      const project = await Project.findOneOrFail({ id: projectId }, { relations: ['users', 'users.role'] })

      const isManager = !!project.users.find(manager => manager.id === context.payload.id || context.payload.role === RoleName.ADMIN)

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
