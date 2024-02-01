import express, { RequestHandler } from 'express'
import utilCheck from '../utils/parsingUtils'
import aboutMeService from '../services/aboutMeService'
import multer from 'multer'
import path from 'path'
import { NewAboutMeType } from '../types'
import tokenCheck from '../services/tokenServices'
import logger from '../utils/logger'
import fs from 'fs'
import { MongoServerError } from 'mongodb'

const aboutMeRouter = express.Router()

const storage = multer.diskStorage({
  destination: function (_req, _res, cb) {
    cb(null, './public/images')
  },
  filename: function (_req, file, cb) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
})

aboutMeRouter.post('/', upload.single('picture'), (async (request, response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    name,
    description,
    picDesc,
    type,
  }: { name: unknown; description: unknown; picDesc: unknown; type: unknown } =
    request.body
  const data: unknown = {
    name,
    description,
    picDesc,
    type,
    picture: request.file?.filename,
  }
  try {
    const result = await tokenCheck(request)
    if (result !== 'Token authenticated') {
      return response.status(401).json({ error: 'Token invalid' })
    }
    const newPost: NewAboutMeType = utilCheck.parseNewAboutMeData(data)
    const addedPost = await aboutMeService.addAboutMePost(newPost)
    return response.status(201).json(addedPost)
  } catch (error: unknown) {
    logger.error('here: ', error)
    let errorMessage = 'Something went wrong.'
    if (request.file) {
      const filePath = path.join('./public/images', request.file.filename)
      fs.unlinkSync(filePath)
    }
    if (error instanceof MongoServerError && error.message.includes('duplicate key')) {
      console.log('senttttt')
      return response.status(400).send('Title is already taken')
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message
    }
    return response.status(400).send(errorMessage)
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

aboutMeRouter.delete('/:id', (async (request, response) => {
  try {
    const result = await tokenCheck(request)
    if (result !== 'Token authenticated') {
      return response.status(401).json({ error: 'Token invalid' })
    }
    const existingPost = await aboutMeService.getSingleAboutMePost(request.params.id)

    await aboutMeService.deleteAboutMePost(request.params.id)
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
    return response.status(200).json({ message: 'Successful deletion' })
  } catch (error) {
    logger.error(error)
    return response.status(400).json({ error: 'Delete unsuccessful' })
  }
}) as RequestHandler)

aboutMeRouter.put('/:id', upload.single('picture'), (async (request, response) => {
  const id = request.params.id
  const post: unknown = request.body
  console.log('router post: ', post)
  try {
    const result = await tokenCheck(request)
    if (result !== 'Token authenticated') {
      return response.status(401).json({ error: 'Token invalid' })
    }

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
    return response.status(201).json(addedPost)
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    logger.error(error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return response.status(400).send('Title is already taken')
      return
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message
    }
    return response.status(400).send(errorMessage)
  }
}) as RequestHandler)

export default aboutMeRouter
