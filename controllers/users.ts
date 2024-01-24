import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user'
const userRouter = express.Router()

userRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  if (password.length < 6) {
    throw new Error('Password is too short')
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
  })

  const savedUser = await user.save()

  return response.status(201).json(savedUser)
})

userRouter.get('/', async (_request, response) => {
  const user = await User.find({})
  return response.json(user)
})

export default userRouter