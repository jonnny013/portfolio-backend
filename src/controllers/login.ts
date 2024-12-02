import express from 'npm:express'
import type { Request, Response } from 'npm:express'
import User from '../modelsMongoose/user.ts'
const loginRouter = express.Router()
import jwt from 'npm:jsonwebtoken'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"
import { check } from 'npm:express-validator'
import loginService from '../services/loginService.ts'
import dotenv from 'npm:dotenv'
import { UserDocument } from '../modelsMongoose/user.ts'
import process from 'node:process'
import { LoginParser } from '../utils/parsers.ts'
dotenv.config()

loginRouter.post(
  '/',
  [check('username').isString(), check('password').isString()],
  async (request: Request, response: Response): Promise<void> => {
    const login = LoginParser.parse(request.body)
    const { username, password } = login

    const user: UserDocument | null = await User.findOne({ username })
    if (user?.accountStatus.locked) {
      response.status(403).json({ error: 'Your account has been locked' })
    }
    if (user && 'passwordHash' in user && user.passwordHash) {
      const passwordCorrect: boolean =
        user === null ? false : await bcrypt.compare(password, user.passwordHash)

      if (!passwordCorrect) {
        void loginService.onFailedLogin(user, request)
      }
      if (!(user && passwordCorrect)) {
        response.status(400).json({ error: 'Invalid login information' })
      }
      void loginService.onLoginSuccess(user, request)
      const userForToken = {
        username: user.username,
        id: user._id,
      }

      const token = jwt.sign(userForToken, process.env.SECRET!, {
        expiresIn: 1440 * 60,
      })
      response.status(200).send({ token, username: user.username })
    } else {
      response.status(400).json({ error: 'Invalid login information' })
    }
  }
)

export default loginRouter
