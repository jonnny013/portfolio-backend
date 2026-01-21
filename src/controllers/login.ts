import express from 'express'
import type { Request, Response } from 'express'
import User from '../modelsMongoose/user.js'
const loginRouter = express.Router()
import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { check } from 'express-validator'
import loginService from '../services/loginService.js'
import dotenv from 'dotenv'
import { UserDocument } from '../modelsMongoose/user.js'
import process from 'node:process'
import { LoginParser } from '../utils/parsers.js'
dotenv.config()

loginRouter.post(
  '/',
  [check('username').isString(), check('password').isString()],
  async (request: Request, response: Response): Promise<void> => {
    const login = LoginParser.parse(request.body)
    const { username, password } = login

    const user: UserDocument | null = await User.findOne({ username })

    if (!user) {
      response.status(400).json({ error: 'Invalid login information' })
      return
    }

    if (user.accountStatus.locked) {
      response.status(403).json({ error: 'Your account has been locked' })
      return
    }

    if (!('passwordHash' in user) || !user.passwordHash) {
      response.status(500).json({ error: 'Something went wrong' })
      return
    }
    
    const passwordCorrect: boolean =
      user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
      void loginService.onFailedLogin(user, request)
    }
    if (!passwordCorrect) {
      response.status(400).json({ error: 'Invalid login information' })
      return
    }

    void loginService.onLoginSuccess(user, request)
    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET!, {
      expiresIn: 1440 * 60,
    })

    response.status(200).json({ token, username: user.username })
  },
)

export default loginRouter
