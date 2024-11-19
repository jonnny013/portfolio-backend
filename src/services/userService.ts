import User from '../models/user.ts'
import  bcrypt from 'npm:bcrypt'
import { UserType } from '../types.d.ts'

const getUser = async (): Promise<Pick<UserType, 'id' | 'username'>[]> => {
  const user = await User.find({})
  return user.map(({ id, username }) => ({
    id,
    username,
  }))
}

const addUser = async ({
  password,
  username,
}: {
  password: string
  username: string
}) => {
  if (password.length < 6) {
    throw new Error('Password is too short')
  }
  const dateAdded = new Date().toString()
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const accountStatus = {
    active: true,
    locked: false,
    failedLoginAttempts: 0,
  }
  const loginRecord: never[] = []

  const user = new User({
    username,
    passwordHash,
    dateAdded,
    accountStatus,
    loginRecord,
  })
  const savedUser = await user.save()
  return savedUser
}

export default { getUser, addUser }
