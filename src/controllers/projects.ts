import express, { RequestHandler } from 'express'
import projectService from '../services/projectService.ts'
import middleware from '../utils/middleware.ts'
import logger from '../utils/logger.ts'
import { OldProjectParser, ProjectParser } from '../utils/parsers.ts'
const projectRouter = express.Router()

projectRouter.post('/', middleware.tokenCheck, (async (request, response) => {
  try {
    const newPost = ProjectParser.parse(request.body)
    const addedPost = await projectService.addProject(newPost)
    response.status(201).json(addedPost)
  } catch (error: unknown) {
    logger.error(error)
    let errorMessage = 'Something went wrong.'
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      response.status(400).send('Title is already taken')
    }

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message
    }
    response.status(400).send(errorMessage)
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

projectRouter.delete('/:id', middleware.tokenCheck, (async (request, response) => {
  try {
    await projectService.deleteProject(request.params.id)
    response.status(200).json({ message: 'Successful deletion' })
  } catch (error) {
    logger.error(error)
    response.status(400).json({ error: 'Delete unsuccessful' })
  }
}) as RequestHandler)

projectRouter.put('/:id', middleware.tokenCheck, (async (request, response) => {
  const id = request.params.id
  const post: unknown = request.body
  try {
    const newPost = OldProjectParser.parse(post)
    const addedPost = await projectService.editProject(newPost, id)
    return response.status(201).json(addedPost)
  } catch (error: unknown) {
    logger.error(error)
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
