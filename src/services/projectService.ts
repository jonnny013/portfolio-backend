import Project from '../models/project'
import { NewProject } from '../types'

const getProject = async () => {
  const project = await Project.find({})
  return project
}

const addProject = async (object: NewProject) => {
  const dateAdded = new Date().toString()

  const project = new Project({
    ...object,
    dateAdded,
  })
  const savedProject = await project.save()
  return savedProject
}

export default { getProject, addProject }
