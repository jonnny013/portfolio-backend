import mongoose from 'mongoose'
import { isEmail } from 'validator'

const emailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  message: {
    type: String,
    required: true,
    minLength: 5,
    unique: true
  },
  subject: {
    type: String,
    required: true,
    minLength: 3,
  },
  dateAdded: {
    type: Date,
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail, 'invalid email'],
  },
})

emailSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const EmailPost = mongoose.model('EmailPost', emailSchema)

export default EmailPost
