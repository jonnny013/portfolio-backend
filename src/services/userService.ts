import User from '../models/user'
import bcrypt from 'bcrypt'

const getUser = async () => {
  const user = await User.find({})
  return user
}

const addUser = async ({password, username}: {password: string, username: string}) => {
  if (password.length < 6) {
    throw new Error('Password is too short')
  }
  const dateAdded = new Date().toString()
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    dateAdded
  })
    const savedUser = await user.save()
  return savedUser
}

export default {getUser, addUser}