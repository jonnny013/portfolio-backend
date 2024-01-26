import express, { RequestHandler } from 'express'
import utilCheck from '../utils/parsingUtils'

import emailService from '../services/emailService'
const emailRouter = express.Router()

emailRouter.post('/', (async (request, response) => {
  try {
    const newEmail = utilCheck.parseEmail(request.body)
    const addedPost =  await emailService.addEmail({email: newEmail, request})
    return response.status(200).json(addedPost)
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      response.status(400).send('Message has already been sent')
      return
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message + error
    }
    return response.status(400).send(errorMessage)
  }
}) as RequestHandler)

export default emailRouter