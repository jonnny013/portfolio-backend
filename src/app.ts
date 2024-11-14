import express from 'express'
import cors from 'cors'
import logger from './utils/logger'
import config from './config/config'
import userRouter from './controllers/users'
import mongoose from 'mongoose'
import middleware from './utils/middleware'
import projectRouter from './controllers/projects'
import aboutMeRouter from './controllers/aboutMePosts'
import loginRouter from './controllers/login'
import emailRouter from './controllers/emailContact'
import visitorRouter from './controllers/visitor'
import path from 'path'

mongoose.set('strictQuery', false)

if (typeof config.MONGODB_URI === 'string') {
  logger.info('connecting to', config.MONGODB_URI)
  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      logger.info('Connected to MongoDB')
    })
    .catch(error => {
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

const staticFilesPath = path.join(__dirname, '../../dist')
console.log(staticFilesPath)

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

app.get('*', (_req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
