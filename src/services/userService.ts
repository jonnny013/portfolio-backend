import User from '../models/user'
import bcrypt from 'bcrypt'
import { UserType } from '../types'

const getUser = async (): Promise<Pick<UserType, "id" | "username">[]> => {
  const user = await User.find({})
  return user.map(({id, username}) => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    id ,
    username
  }))
}

const addUser = async ({password, username}: {password: string, username: string}) => {
  if (password.length < 6) {
    throw new Error('Password is too short')
  }
  const dateAdded = new Date().toString()
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const accountStatus = {
    active: true,
    locked: false
  }
  const loginRecord = {
    time: [],
    ipAddress: [],
    device: []
  }

  const user = new User({
    username,
    passwordHash,
    dateAdded,
    accountStatus,
    loginRecord
  })
    const savedUser = await user.save()
  return savedUser
}

export default {getUser, addUser}