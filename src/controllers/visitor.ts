import express, { RequestHandler } from 'express'
import middleware from '../utils/middleware'
import logger from '../utils/logger'
import visitorInfoService from '../services/visitorInfoService'
const visitorRouter = express.Router()

visitorRouter.post('/', (async (request, response) => {
  try {
    await visitorInfoService.addVisitor(request)
    response.status(201).json('Successful save')
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

visitorRouter.get('/', middleware.tokenCheck, (async (_request, response) => {
  try {
  const user = await visitorInfoService.getVisitor()
  if (user) {
    return response.json(user)
  } else {
    return response.sendStatus(404)
  }
  } catch (error) {
    logger.error(error) 
    return response.status(401).send({ error: error})
  }
  
}) as RequestHandler)

export default visitorRouter
