import express from 'express'
import cors from 'cors'
import logger from './utils/logger'
import config from './utils/config'
import userRouter from './controllers/users'
import mongoose from 'mongoose'
import middleware from './utils/middleware'
import projectRouter from './controllers/projects'
import aboutMeRouter from './controllers/aboutMePosts'

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

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use(middleware.requestLogger)

app.use('/api/user', userRouter)
app.use('/api/projects', projectRouter)
app.use('/api/aboutMe', aboutMeRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
