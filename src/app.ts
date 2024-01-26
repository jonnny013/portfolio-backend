import express from 'express'
import cors from 'cors'
import logger from './utils/logger'
import config from './utils/config'
import userRouter from './controllers/users'
import mongoose from 'mongoose'
import middleware from './utils/middleware'
import projectRouter from './controllers/projects'
import aboutMeRouter from './controllers/aboutMePosts'
import loginRouter from './controllers/login'
import User from './models/user'

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

//update old users

const updateUsers = async () => {
  try {
    const users = await User.find()

    for (const user of users) {
      // Create a new user object with the updated schema
      const updatedUser = {
        username: user.username,
        passwordHash: user.passwordHash,
        dateAdded: user.dateAdded,
        loginRecord: [
          {
            time: user.dateAdded, // or set it to a default value based on your requirements
            ipAddress: '', // set a default or derive it from existing data
            device: '', // set a default or derive it from existing data
          },
        ],
        accountStatus: {
          active: true, // set a default or derive it from existing data
          locked: false, // set a default or derive it from existing data
          failedLoginAttempts: 0, // set a default or derive it from existing data
        },
      }

      // Save the updated user
      await User.findByIdAndUpdate(user._id, updatedUser, { new: true })
    }

    console.log('User data migration complete.')
  } catch (error) {
    console.error('Error during user data migration:', error)
  } finally {
    void mongoose.disconnect()
  }
}

void updateUsers()

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use(middleware.requestLogger)

app.use('/api/user', userRouter)
app.use('/api/projects', projectRouter)
app.use('/api/aboutMe', aboutMeRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
