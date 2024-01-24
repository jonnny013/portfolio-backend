import Project from '../models/project'
import { NewProject, ProjectType } from '../types'

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
  const dateAdded = new Date().toString()

  const project = new Project({
    ...object,
    dateAdded,
  })
  const savedProject = await project.save()
  return savedProject
}

const editProject = async (object: ProjectType, id: string) => {
  const updatedProject = await Project.findByIdAndUpdate(id, object, {new: true})

  return updatedProject
}

export default { getProject, addProject, getSingleProject, deleteProject, editProject }
