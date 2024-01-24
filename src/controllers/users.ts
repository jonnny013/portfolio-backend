import express, {RequestHandler} from 'express'
import userService from '../services/userService'
import utilCheck from '../utils/parsingUtils'
const userRouter = express.Router()


userRouter.post('/', (request, response) => {
  try {
    const newUser = utilCheck.parseUserData(request.body)
    const addedUser = userService.addUser(newUser)
    response.status(201).json(addedUser)
  } catch(error: unknown) {
    let errorMessage = 'Something went wrong.'
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message
    }
    response.status(400).send(errorMessage)
  }
})

userRouter.get('/', ( (_request, response) => {

    const user =  userService.getUser
    if (user) {
      response.json(user)
    } else {
      response.sendStatus(404)
    }

}) as RequestHandler)

export default userRouter
