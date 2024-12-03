import express from 'npm:express'
import 'npm:express-async-errors'
import type { Request, Response } from 'npm:express'
import cors from 'npm:cors'
import logger from './utils/logger.ts'
import config from './config/config.ts'
import userRouter from './controllers/users.ts'
import mongoose from 'npm:mongoose'
import middleware from './utils/middleware.ts'
import projectRouter from './controllers/projects.ts'
import aboutMeRouter from './controllers/aboutMePosts.ts'
import loginRouter from './controllers/login.ts'
import emailRouter from './controllers/emailContact.ts'
import visitorRouter from './controllers/visitor.ts'
import path from 'node:path'

//const __dirname = dirname(new URL(import.meta.url).pathname)
const __dirname = import.meta.dirname as string
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

const staticFilesPath = path.join(__dirname, '../dist')

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
