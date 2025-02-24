import mongoose from 'npm:mongoose'

const SkillsSchema = new mongoose.Schema(
  {
    css: Boolean,
    html: Boolean,
    node: Boolean,
    react: Boolean,
    bootstrap: Boolean,
    materialUI: Boolean,
    mongoDB: Boolean,
    express: Boolean,
    javascript: Boolean,
    typescript: Boolean,
  },
  { _id: false, versionKey: false }
)

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  project: {
    type: String,
    required: true,
    minLength: 3,
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
  },
  website: {
    type: String,
    required: true,
    minLength: 5,
  },
  sourceCode: {
    type: String,
    minLength: 5,
  },
  skills: {
    type: SkillsSchema,
    required: true,
  },
  dateAdded: {
    type: Date,
  },
  recommended: {
    type: Boolean,
    required: true,
  },
})

projectSchema.set('toJSON', {
  transform: (_document: unknown, returnedObject: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id?.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Project = mongoose.model('Project', projectSchema)

export default Project
