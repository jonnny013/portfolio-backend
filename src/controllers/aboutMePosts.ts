import express, { RequestHandler } from 'express'
import utilCheck from '../utils/parsingUtils'
import aboutMeService from '../services/aboutMeService'
import path from 'path'
import middleware from '../utils/middleware'
import logger from '../utils/logger'
import fs from 'fs'
import { MongoServerError } from 'mongodb'
import { upload } from '../config/multer_file_config'

const aboutMeRouter = express.Router()

interface RequestBody {
  name: unknown
  description: unknown
  picDesc: unknown
  type: unknown
}

aboutMeRouter.post('/', middleware.tokenCheck, upload.single('picture'), (async (
  request,
  response
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { name, description, picDesc, type }: RequestBody = request.body
  const data: unknown = {
    name,
    description,
    picDesc,
    type,
    picture: request.file?.filename,
  }
  try {
    const newPost = utilCheck.parseNewAboutMeData(data)
    const addedPost = await aboutMeService.addAboutMePost(newPost)
    response.status(201).json(addedPost)
  } catch (error: unknown) {
    logger.error('here: ', error)
    if (error instanceof MongoServerError && error.message.includes('duplicate key')) {
      response.status(400).send('Title is already taken')
    }
    response.status(400).send(error)
  }
}) as RequestHandler)

aboutMeRouter.get('/', (async (_request, response) => {
  const post = await aboutMeService.getAboutMePost()
  if (post) {
    response.json(post)
  } else {
    response.sendStatus(404)
  }
}) as RequestHandler)

aboutMeRouter.get('/:id', (async (request, response) => {
  const post = await aboutMeService.getSingleAboutMePost(request.params.id)
  if (post) {
    response.json(post)
  } else {
    response.sendStatus(404)
  }
}) as RequestHandler)

aboutMeRouter.delete('/:id', middleware.tokenCheck, (async (request, response) => {
  try {
    const existingPost = await aboutMeService.getSingleAboutMePost(request.params.id)

    await aboutMeService.deleteAboutMePost(request.params.id)
    if (request.file && existingPost && existingPost.picture) {
      try {
        const oldPicturePath = path.join('./public/images', existingPost.picture)
        fs.unlinkSync(oldPicturePath)
      } catch (error) {
        if (error && typeof error === 'object' && 'message' in error) {
          logger.error('Error deleting old picture:', error.message)
        } else {
          logger.error('Couldnt delete file')
        }
      }
    }
    response.status(200).json({ message: 'Successful deletion' })
  } catch (error) {
    logger.error(error)
    response.status(400).json({ error: 'Delete unsuccessful' })
  }
}) as RequestHandler)

aboutMeRouter.put('/:id', middleware.tokenCheck, upload.single('picture'), (async (
  request,
  response
) => {
  const id = request.params.id
  const post: unknown = request.body
  console.log('router post: ', post)
  try {
    const existingPost = await aboutMeService.getSingleAboutMePost(id)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const object = {
      ...(typeof post === 'object' ? post : { post }),
      ...(post && typeof post === 'object' && 'formdata' in post
        ? { picture: request.file?.filename }
        : {}),
    }
    const newPost = utilCheck.parseOldAboutMeData(object)
    const addedPost = await aboutMeService.editAboutMePost(newPost, id)
    if (request.file && existingPost && existingPost.picture) {
      try {
        const oldPicturePath = path.join('./public/images', existingPost.picture)
        fs.unlinkSync(oldPicturePath)
      } catch (error) {
        if (error && typeof error === 'object' && 'message' in error) {
          console.error('Error deleting old picture:', error.message)
        } else {
          console.error('Couldnt delete file')
        }
      }
    }
    response.status(201).json(addedPost)
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    logger.error(error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      response.status(400).send('Title is already taken')
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message
    }
    response.status(400).send(errorMessage)
  }
}) as RequestHandler)

export default aboutMeRouter
