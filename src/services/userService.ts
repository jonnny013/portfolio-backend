import User from '../modelsMongoose/user'
import * as bcrypt from 'bcrypt'
import { UserType } from '../types'

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

  const passwordHash = await bcrypt.hash(password)
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

const updatePassword = async (password: string, userId: string, originalPass: string) => {
  const passwordHash = await bcrypt.hash(password)

  const user = await User.findById(userId)

  if (!user) throw new Error('no user found')

  const ok = await bcrypt.compare(originalPass, user.passwordHash)

  if (!ok) throw new Error('bad password')

  user.passwordHash = passwordHash
  await user.save()

  return true
}

export default { getUser, addUser, updatePassword }
