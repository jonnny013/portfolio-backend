import Project from '../modelsMongoose/project.js'
import { NewProject, ProjectType } from '../types.js'

const getProject = async () => {
  const project = await Project.find({})
  return project
}

const getSingleProject = async (id: string) => {
  const project = await Project.findById(id)
  return project
}

const deleteProject = async (id: string) => {
  const response = await Project.findByIdAndDelete(id)
  return response
}

const addProject = async (object: NewProject) => {
  try {
    const dateAdded = new Date().toString()
    const project = new Project({
      ...object,
      dateAdded,
    })
    const savedProject = await project.save()
    console.log('end', savedProject)
    return savedProject
  } catch (error) {
    console.log(error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      throw new Error('Title is already taken')
    } else {
      throw new Error('Database error')
    }
  }
}

const editProject = async (object: ProjectType, id: string) => {
  const updatedProject = await Project.findByIdAndUpdate(id, object, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  return updatedProject
}

export default { getProject, addProject, getSingleProject, deleteProject, editProject }
