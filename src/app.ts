import express from 'express'
import 'express-async-errors'
import type { Request, Response } from 'express'
import cors from 'cors'
import logger from './utils/logger.js'
import config from './config/config.js'
import userRouter from './controllers/users.js'
import mongoose from 'mongoose'
import middleware from './utils/middleware.js'
import projectRouter from './controllers/projects.js'
import aboutMeRouter from './controllers/aboutMePosts.js'
import loginRouter from './controllers/login.js'
import emailRouter from './controllers/emailContact.js'
import visitorRouter from './controllers/visitor.js'
import path from 'node:path'

//const __dirname = dirname(new URL(import.meta.url).pathname)
import { fileURLToPath } from 'node:url'
let __dirname: string
try {
  __dirname = path.dirname(fileURLToPath(import.meta.url))
} catch {
  __dirname = process.cwd()
}
mongoose.set('strictQuery', false)

if (typeof config.MONGODB_URI === 'string') {
  logger.info('connecting to', config.MONGODB_URI)
  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      logger.info('Connected to MongoDB')
    })
    .catch((error: { message: unknown }) => {
      if (
        error &&
        typeof error === 'object' &&
        error.message &&
        typeof error.message === 'string'
      ) {
        logger.error('Error connecting to MongoDB', error.message)
      }
    })
}

const staticFilesPath = path.join(
  __dirname,
  process.env.NODE_ENV === 'development' ? '../dist' : '../../dist',
)

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use(express.static('dist'))
app.use(express.static(staticFilesPath))
app.use(middleware.requestLogger)

app.use('/api/user', userRouter)
app.use('/api/projects', projectRouter)
app.use('/api/aboutMe', aboutMeRouter)
app.use('/api/login', loginRouter)
app.use('/api/email', emailRouter)
app.use('/api/visitorLog', visitorRouter)

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(staticFilesPath, 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
