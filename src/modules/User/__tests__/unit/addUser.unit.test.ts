import User from "../../../../entity/User";

const mockUser: {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  password?: string
} = {
  firstName: 'User3',
  lastName: 'lastName3',
  username: 'username3',
  email: 'username3@user.com',
  password: 'azerty123'
}


describe('Add a new user in db', () => {
  it('should add a new user in db', async () => {
    const addUser = User.create(mockUser)

    await expect(addUser.save()).resolves.toBeDefined()
    await expect(addUser.save()).resolves.toBeInstanceOf(User)
  });

  it('should thrown an error when NOT NULL constraint failed: user.firstName', async () => {
    delete mockUser.firstName

    const addUserWhitoutFirstName = User.create(mockUser)

    await expect(addUserWhitoutFirstName.save()).rejects.toThrowError("SqliteError: NOT NULL constraint failed: user.firstName")
  });

  it('should thrown an error when NOT NULL constraint failed: user.lastName', async () => {
    mockUser.firstName = 'User3'
    delete mockUser.lastName

    const addUserWhitoutlastName = User.create(mockUser)

    await expect(addUserWhitoutlastName.save()).rejects.toThrowError("SqliteError: NOT NULL constraint failed: user.lastName")
  });

  it('should thrown an error when NOT NULL constraint failed: user.username', async () => {
    mockUser.firstName = 'User3'
    mockUser.lastName = 'lastName3'
    delete mockUser.username

    const addUserWhitoutUsername = User.create(mockUser)

    await expect(addUserWhitoutUsername.save()).rejects.toThrowError("SqliteError: NOT NULL constraint failed: user.username")
  });

  it('should thrown an error when NOT NULL constraint failed: user.email', async () => {
    mockUser.firstName = 'User3'
    mockUser.lastName = 'lastName3'
    mockUser.username = 'username3'
    delete mockUser.email

    const addUserWhitoutEmail = User.create(mockUser)

    await expect(addUserWhitoutEmail.save()).rejects.toThrowError("SqliteError: NOT NULL constraint failed: user.email")
  });

  it('should thrown an error when NOT NULL constraint failed: user.password', async () => {
    mockUser.firstName = 'User3'
    mockUser.lastName = 'lastName3'
    mockUser.username = 'username3'
    mockUser.email = 'username3@user.com'
    delete mockUser.password

    const addUserWhitoutPassword = User.create(mockUser)

    await expect(addUserWhitoutPassword.save()).rejects.toThrowError("SqliteError: NOT NULL constraint failed: user.password")
  });
});