import AboutMePost from '../models/aboutMePost'
import { NewAboutMeType, AboutMeType } from '../types'

const getAboutMePost = async () => {
  const aboutMePost = await AboutMePost.find({})
  return aboutMePost
}

const getSingleAboutMePost = async (id: string) => {
  const aboutMePost = await AboutMePost.findById(id)
  return aboutMePost
}

const deleteAboutMePost = async (id: string) => {
  const response = await AboutMePost.findByIdAndDelete(id)
  
  return response
}

const addAboutMePost = async (object: NewAboutMeType) => {
  const dateAdded = new Date().toString()

  const aboutMePost = new AboutMePost({
    ...object,
    dateAdded,
  })
  const savedAboutMePost = await aboutMePost.save()
  return savedAboutMePost
}

const editAboutMePost = async (object: AboutMeType, id: string) => {
  const updatedAboutMePost = await AboutMePost.findByIdAndUpdate(id, object, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  return updatedAboutMePost
}

export default { getAboutMePost, addAboutMePost, getSingleAboutMePost, deleteAboutMePost, editAboutMePost }
