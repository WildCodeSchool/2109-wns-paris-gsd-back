import createServer from '../../server'
import User from '../../entity/User'
import Role, { RoleName } from '../../entity/Role'


let server: ApolloServer

beforeAll(async () => {
  server = await createServer()
})

describe('login resolver', () => {
  // describe('Add User mutation', () => {
  //   it('Create a user and retrieve a user created', async () => {
  //     // * creer un role USER
  //     const roleUser = Role.create({
  //       label: 'USER' as RoleName
  //     })

  //     await roleUser.save()
      
  //     // ! creer un user avec la mutation
  //     const addUserMutation = gql`
  //     mutation Mutation($data: UserInput!) {
  //       addUser(data: $data) {
  //         firstName
  //         lastName
  //         username
  //         email
  //       }
  //     }
  //     `
      
  //     const variables = {
  //       data: {
  //         firstName: "toto",
  //         lastName: "tata",
  //         username: "tatadetoto",
  //         email: "tata@toto.td",
  //         password: "lannister"
  //       } 
  //     }


  //     // ! recuperer ce user directement via typeORM
  //     const { data, errors } = await server.executeOperation({
  //       query: addUserMutation,
  //       variables,
  //     })

  //     expect(!errors).toBeTruthy()

  //     const expectedResult = await User.findOne<User>({email: 'tata@toto.td'})

  //     expect(data!.addUser).toEqual(expect.objectContaining({
  //       firstName: expectedResult!.firstName,
  //       lastName: expectedResult!.lastName,
  //       username: expectedResult!.username,
  //       email: expectedResult!.email


  //     }));
  
  //   })
  // })

  describe('Get users query', () => {
    it('should retrieve a list of users', async () => {
      
      
      // TODO Matildad 
      // ? Creer un role user (voir le test commente plus haut)

      // * Creer des utilisateurs (un array d'users)
      // * Ici on va utiliser la methode create de typeORM (User.create(data)
      // ! Faire une boucle pour venir creer pour users

      // * Faire la query voir le test sur recuperation de tous les roles
      // ? Verifier (expect) => resultat [User]
    });
  });
})