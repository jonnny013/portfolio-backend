// deno-types="npm:@types/express"
import express from 'npm:express'
import type { Request, Response } from 'npm:express'
import emailService from "../services/emailService.ts"
import { ContactFormParser } from "../utils/parsers.ts";
const emailRouter = express.Router()

emailRouter.post('/', (async (request: Request, response: Response) => {
  try {
    const newEmail = ContactFormParser.parse(request.body)
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
}))

export default emailRouter