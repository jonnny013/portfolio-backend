import express from 'express'
import type { Request, Response } from 'express'
import emailService from '../services/emailService.js'
import { ContactFormParser } from '../utils/parsers.js'

const emailRouter = express.Router()

emailRouter.post('/', async (request: Request, response: Response) => {
  try {
    const newEmail = ContactFormParser.parse(request.body)
    const addedPost = await emailService.addEmail({ email: newEmail, request })
    response.status(200).json(addedPost)
    return
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      response.status(400).send('Message has already been sent')
      return
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message + error
    }
    response.status(400).send(errorMessage)
    return
  }
})

export default emailRouter
