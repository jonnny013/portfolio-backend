import express, { RequestHandler } from 'express'
import userService from '../services/userService'
import utilCheck from '../utils/parsingUtils'
const projectRouter = express.Router()

projectRouter.post('/', (async (request, response) => {
  try {
    const newPost = utilCheck.parseProjectData(request.body)
    const addedPost = await userService.addUser(newPost)
    response.status(201).json(addedPost)
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      response.status(400).send('Username is already taken')
      return
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message
    }
    response.status(400).send(errorMessage)
  }
}) as RequestHandler)

projectRouter.get('/', (async (_request, response) => {
  const user = await userService.getUser()
  if (user) {
    response.json(user)
  } else {
    response.sendStatus(404)
  }
}) as RequestHandler)

export default projectRouter
