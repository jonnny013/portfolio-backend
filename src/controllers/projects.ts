import express, { RequestHandler } from 'express'
import utilCheck from '../utils/parsingUtils'
import projectService from '../services/projectService'
import tokenCheck from '../services/tokenServices'
const projectRouter = express.Router()

projectRouter.post('/', (async (request, response) => {
  try {
    const result = await tokenCheck(request)
    if (result !== 'Token authenticated') {
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
    const result = await tokenCheck(request)
    if (result !== 'Token authenticated') {
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
    const result = await tokenCheck(request)
    if (result !== 'Token authenticated') {
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
