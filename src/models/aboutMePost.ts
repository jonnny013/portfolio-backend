import mongoose from 'mongoose'

const aboutMeSchema = new mongoose.Schema({
  picture: {
    type: Buffer,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
  },
  picDesc: {
    type: String,
    required: true,
    minLength: 3,
  },
  dateAdded: {
    type: Date,
  },
  type: {
    type: String,
    required: true
  }
})

aboutMeSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const AboutMePost = mongoose.model('AboutMePost', aboutMeSchema)

export default AboutMePost
