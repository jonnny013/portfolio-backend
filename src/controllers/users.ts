import express from 'express'
import type { Request, Response } from 'express'
import userService from '../services/userService.js'
//import utilCheck from '../utils/parsingUtils'
const userRouter = express.Router()

// userRouter.post('/', (async (request, response) => {
//   try {
//     const newUser = utilCheck.parseUserData(request.body)
//     const addedUser = await userService.addUser(newUser)
//     response.status(201).json(addedUser)
//   } catch (error: unknown) {
//     let errorMessage = 'Something went wrong.'
//     if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
//       response.status(400).send('Username is already taken')
//       return
//     }

//     if (error instanceof Error) {
//       errorMessage += ' Error: ' + error.message
//     }
//     response.status(400).send(errorMessage)
//   }
// }) as RequestHandler)

userRouter.get('/', async (_request: Request, response: Response) => {
  const user = await userService.getUser()
  if (user) {
    response.json(user)
  } else {
    response.sendStatus(404)
  }
})

userRouter.post('/:id/reset_pass', async (request: Request, response: Response) => {
  const pass = request.body.password
  const originalPass = request.body.originalPassword
  const userId = request.params.id

  try {
    await userService.updatePassword(pass, userId, originalPass)
    response.status(200).json({ message: 'ok' })
  } catch (err) {
    response
      .status(400)
      // @ts-ignore
      .json({ message: 'unable to update password', error: err.message })
  }
})

export default userRouter
