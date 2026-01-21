import express from 'express'
import type { Request, Response } from 'express'
import aboutMeService from '../services/aboutMeService.js'
import middleware from '../utils/middleware.js'
import logger from '../utils/logger.js'
import { MongoServerError } from 'mongodb'
import { upload } from '../config/multer_file_config.js'
import { saveToS3 } from '../config/s3_bucket.js'
import { AboutMeParser } from '../utils/parsers.js'

const aboutMeRouter = express.Router()

aboutMeRouter.post(
  '/',
  middleware.tokenCheck,
  upload.single('picture'),
  async (request: Request, response: Response) => {
    const { file } = request
    if (!file) {
      throw new Error('No file given')
    }
    const savedItemName = await saveToS3(file, file.originalname, file.mimetype)
    const newPost = AboutMeParser.parse({
      ...request.body,
      picture: savedItemName,
    })
    try {
      const addedPost = await aboutMeService.addAboutMePost(newPost)
      response.status(201).json(addedPost)
    } catch (error: unknown) {
      logger.error('here: ', error)
      if (error instanceof MongoServerError && error.message.includes('duplicate key')) {
        response.status(400).send('Title is already taken')
      }
      response.status(400).send(error)
    }
  },
)

aboutMeRouter.get('/', async (_request: Request, response: Response) => {
  const post = await aboutMeService.getAboutMePost()
  if (post) {
    response.json(post)
  } else {
    response.sendStatus(404)
  }
})

aboutMeRouter.get('/:id', async (request: Request, response: Response) => {
  const post = await aboutMeService.getSingleAboutMePost(request.params.id)
  if (post) {
    response.json(post)
  } else {
    response.sendStatus(404)
  }
})

aboutMeRouter.delete(
  '/:id',
  middleware.tokenCheck,
  async (request: Request, response: Response) => {
    try {
      await aboutMeService.deleteAboutMePost(request.params.id)

      response.status(200).json({ message: 'Successful deletion' })
    } catch (error) {
      logger.error(error)
      response.status(400).json({ error: 'Delete unsuccessful' })
    }
  },
)

aboutMeRouter.put(
  '/:id',
  middleware.tokenCheck,
  upload.single('picture'),
  async (request: Request, response: Response) => {
    const id = request.params.id
    const post: unknown = request.body
    console.log('router post: ', post)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const object = {
        ...(typeof post === 'object' ? post : { post }),
        ...(post && typeof post === 'object' && 'formdata' in post
          ? { picture: request.file?.filename }
          : {}),
      }

      const updatedPost = AboutMeParser.parse(object)
      const changedPost = await aboutMeService.editAboutMePost(
        updatedPost,
        id,
        request.file,
      )

      response.status(201).json(changedPost)
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
  },
)

export default aboutMeRouter
