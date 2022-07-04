import User from "../../../../entity/User";


describe('Find user', () => {
  beforeEach(async () => {
    await User.create({
      firstName: 'User1',
      lastName: 'lastName1',
      username: 'username1',
      email: 'username1@user.com',
      password: 'azerty123'
    }).save()
  });

  it('should find an user present in db', async () => {
    const findUser = await User.findOneOrFail({ firstName: "User1" })

    expect(findUser).toBeDefined()
    expect(findUser.id).toEqual(1)
    expect(findUser.email).toEqual('username1@user.com')
  });

  it('should throw an error when no user founded in db', async () => {
    await expect(User.findOneOrFail({ firstName: "User2" })).rejects.toThrowError(/^Could not find any entity of type "User" matching:/ig)
  });
});