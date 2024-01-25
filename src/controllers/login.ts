import express, { RequestHandler } from 'express'
import User from '../models/user'
const loginRouter = express.Router()
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import parsingUtils from '../utils/parsingUtils'
import { check } from 'express-validator'
import dotenv from 'dotenv'
dotenv.config()

loginRouter.post('/',[check('username').isString(), check('password').isString()], (async (request, response) => {
  const { username, password } = request.body as { username: string; password: string }
  if (username && parsingUtils.isString(username) && parsingUtils.isString(password)) {
    const user = await User.findOne({ username })
    if (user && 'passwordHash' in user && user.passwordHash) {
      const passwordCorrect =
        user === null ? false : await bcrypt.compare(password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        return response.status(400).json({ error: 'Invalid login information' })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      const token = jwt.sign(userForToken, process.env.SECRET!)
      return response.status(200).send({ token, username: user.username })
    } else {
      return response.status(400).json({ error: 'Invalid login information' })
    }
  } else {
    return response.status(400).json({ error: 'Invalid login information' })
  }
}) as RequestHandler)

export default loginRouter
