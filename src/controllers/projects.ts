import express, { RequestHandler, Request } from 'express'
import jwt from 'jsonwebtoken'
import utilCheck from '../utils/parsingUtils'
import projectService from '../services/projectService'
const projectRouter = express.Router()

const getTokenFrom = (request: Request): string | null => {
  const authorization: string | undefined = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

projectRouter.post('/', (async (request, response) => {
  try {
    const token = getTokenFrom(request)

    if (token === null) {
      return response.status(401).json({ error: 'Token not provided' })
    }

    const secret = process.env.SECRET

    if (!secret) {
      return response
        .status(500)
        .json({ error: 'Internal server error: JWT secret not configured' })
    }

    const decodedToken = jwt.verify(token, secret) as { id?: string }

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token invalid' })
    }
    const newPost = utilCheck.parseNewProjectData(request.body)
    console.log('here1')
    const addedPost = await projectService.addProject(newPost)
    console.log('here2')
    return response.status(201).json(addedPost)
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      response.status(400).send('Title is already taken')
      return
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message + error
    }
    return response.status(400).send(errorMessage)
  }
}) as RequestHandler)

projectRouter.get('/', (async (_request, response) => {
  const project = await projectService.getProject()
  if (project) {
    response.json(project)
  } else {
    response.sendStatus(404)
  }
}) as RequestHandler)

projectRouter.get('/:id', (async (request, response) => {
  const project = await projectService.getSingleProject(request.params.id)
  if (project) {
    response.json(project)
  } else {
    response.sendStatus(404)
  }
}) as RequestHandler)

projectRouter.delete('/:id', (async (request, response) => {
  try {
    const token = getTokenFrom(request)

    if (token === null) {
      return response.status(401).json({ error: 'Token not provided' })
    }

    const secret = process.env.SECRET

    if (!secret) {
      return response
        .status(500)
        .json({ error: 'Internal server error: JWT secret not configured' })
    }

    const decodedToken = jwt.verify(token, secret) as { id?: string }

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token invalid' })
    }
    await projectService.deleteProject(request.params.id)
    return response.status(200).json({ message: 'Successful deletion' })
  } catch (error) {
    return response.status(400).json({error: 'Delete unsuccessful'})
  }
}) as RequestHandler)

projectRouter.put('/:id', (async (request, response) => {
  const id = request.params.id
  const post: unknown = request.body
  try {
    const token = getTokenFrom(request)

    if (token === null) {
      return response.status(401).json({ error: 'Token not provided' })
    }

    const secret = process.env.SECRET

    if (!secret) {
      return response
        .status(500)
        .json({ error: 'Internal server error: JWT secret not configured' })
    }

    const decodedToken = jwt.verify(token, secret) as { id?: string }

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token invalid' })
    }
    const newPost = utilCheck.parseOldProjectData(post)
    const addedPost = await projectService.editProject(newPost, id)
    return response.status(201).json(addedPost)
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      response.status(400).send('Title is already taken')
      return
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message
    }
    return response.status(400).send(errorMessage)
  }
}) as RequestHandler)

export default projectRouter
