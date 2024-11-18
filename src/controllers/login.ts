import express, { Request, Response } from 'express'
import User from "../models/user.ts"
const loginRouter = express.Router()
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import parsingUtils from "../utils/parsingUtils.ts"
import { check } from 'express-validator'
import loginService from "../services/loginService.ts"
import dotenv from 'dotenv'
import { UserDocument } from "../models/user.ts"
import process from "node:process";
dotenv.config()

loginRouter.post(
  '/',
  [check('username').isString(), check('password').isString()],
  async (request: Request, response: Response): Promise<void> => {
    const { username, password } = request.body as { username: string; password: string }

    if (username && parsingUtils.isString(username) && parsingUtils.isString(password)) {
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: user._id,
        }

        const token = jwt.sign(userForToken, process.env.SECRET!, {
          expiresIn: 1440 * 60,
        })
        response.status(200).send({ token, username: user.username })
      } else {
        response.status(400).json({ error: 'Invalid login information' })
      }
    } else {
      response.status(400).json({ error: 'Invalid login information' })
    }
  }
)

export default loginRouter
