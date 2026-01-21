import express from 'express'
import type { Request, Response } from 'express'
import projectService from '../services/projectService.js'
import middleware from '../utils/middleware.js'
import logger from '../utils/logger.js'
import { OldProjectParser, ProjectParser } from '../utils/parsers.js'
const projectRouter = express.Router()

projectRouter.post(
  '/',
  middleware.tokenCheck,
  async (request: Request, response: Response) => {
    const newPost = ProjectParser.parse(request.body)
    const addedPost = await projectService.addProject(newPost)
    response.status(201).json(addedPost)
  },
)

projectRouter.get('/', async (_request: Request, response: Response) => {
  const project = await projectService.getProject()
  if (project) {
    response.json(project)
  } else {
    response.sendStatus(404)
  }
})

projectRouter.get('/:id', async (request: Request, response: Response) => {
  const project = await projectService.getSingleProject(request.params.id)
  if (project) {
    response.json(project)
  } else {
    response.sendStatus(404)
  }
})

projectRouter.delete(
  '/:id',
  middleware.tokenCheck,
  async (request: Request, response: Response) => {
    try {
      await projectService.deleteProject(request.params.id)
      response.status(200).json({ message: 'Successful deletion' })
    } catch (error) {
      logger.error(error)
      response.status(400).json({ error: 'Delete unsuccessful' })
    }
  },
)

projectRouter.put(
  '/:id',
  middleware.tokenCheck,
  async (request: Request, response: Response) => {
    const id = request.params.id
    const post: unknown = request.body
    try {
      const newPost = OldProjectParser.parse(post)
      const addedPost = await projectService.editProject(newPost, id)
      response.status(201).json(addedPost)
      return
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
      response.status(400).send(errorMessage)
      return
    }
  },
)

export default projectRouter
