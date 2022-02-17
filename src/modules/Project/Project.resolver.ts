import { GraphQLError } from "graphql";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Project from "../../entity/Project";

@Resolver(Project)
export default class ProjectResolver {
  @Query(() => [Project])
  async getProjects(): Promise<Project[]>{
    // TODO
    return projects
  }

  @Query(() => Project)
  async getProjectById(@Arg("id") id: string) : Promise<Project | GraphQLError> {
    // TODO find project by id
    
    return project
  }

  @Mutation(() => Project)
 async addProject(@Arg('data') :ProjectInput) : Promise<Project | GraphQLError> {
   // TODO create a project

   return project
 }
}
