import express, { RequestHandler } from 'express'
// import utilCheck from '../utils/parsingUtils'
import aboutMeService from '../services/aboutMeService'
import multer from 'multer'
import path from 'path'

const aboutMeRouter = express.Router()

const storage = multer.diskStorage({
  destination: function (_req, _res, cb) {
    cb(null, './public/images')
  },
  filename: function (_req, file, cb) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    cb(null,  Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})

aboutMeRouter.post('/', upload.single('picture'), ((request, response) => {
  console.log('---file', request.file, '---body', request.body)
  const {name, description, picDesc, type}: unknown = request.body
  const data: unknown = {
    name,
    description,
    picDesc,
    type,
    picture: request.file?.filename
  }
  try {
    const newPost = await utilCheck.parseNewAboutMeData(data)
    const addedPost = await aboutMeService.addAboutMePost( newPost)
    response.status(201).json(addedPost)
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      response.status(400).send('Title is already taken')
      return
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message
    }
    response.status(400).send(errorMessage)
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

aboutMeRouter.delete('/:id', (async (request, response, next) => {
  try {
    await aboutMeService.deleteAboutMePost(request.params.id)
    response.status(200).json({ message: 'Successful deletion' })
  } catch (error) {
    next(error)
  }
}) as RequestHandler)

/* aboutMeRouter.put('/:id', (async (request, response) => {
  const id = request.params.id
  const post: unknown = request.body
  try {
    const newPost = await utilCheck.parseOldAboutMeData(post)
    const addedPost = await aboutMeService.editAboutMePost(newPost, id)
    response.status(201).json(addedPost)
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      response.status(400).send('Title is already taken')
      return
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message
    }
    response.status(400).send(errorMessage)
  }
}) as RequestHandler) */

export default aboutMeRouter
