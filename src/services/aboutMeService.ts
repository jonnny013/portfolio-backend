import { deleteFromS3, getImageFromS3, saveToS3 } from '../config/s3_bucket.ts'
import AboutMePost from '../models/aboutMePost.ts'
import { NewAboutMeType, AboutMeType } from '../types.d.ts'
import type { Express } from 'npm:express'

const getAboutMePost = async () => {
  const aboutMePost = await AboutMePost.find({})
  aboutMePost.forEach((post: { picture: string }) => {
    post.picture = getImageFromS3(post.picture)
  })
  return aboutMePost
}

const getSingleAboutMePost = async (id: string) => {
  const aboutMePost = await AboutMePost.findById(id)
  aboutMePost.picture = getImageFromS3(aboutMePost.picture)
  return aboutMePost
}

const deleteAboutMePost = async (id: string) => {
  const initialPost = await AboutMePost.findById(id)
  if (!initialPost) {
    throw new Error('Post not found')
  }
  if (initialPost.picture) {
    await deleteFromS3(initialPost.picture)
  }
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

const editAboutMePost = async (
  object: AboutMeType,
  id: string,
  file: Express.Multer.File
) => {
  const originalPost = await AboutMePost.findById(id)
  if (file && originalPost) {
    try {
      await deleteFromS3(originalPost.picture)
      const fileName = await saveToS3(file, file.originalname, file.mimetype)
      object.picture = fileName
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        console.error('Error deleting old picture:', error.message)
      } else {
        console.error("Couldn't delete file")
      }
    }
  } else {
    object.picture = originalPost?.picture
  }
  const updatedAboutMePost = await AboutMePost.findByIdAndUpdate(id, object, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  return updatedAboutMePost
}

export default {
  getAboutMePost,
  addAboutMePost,
  getSingleAboutMePost,
  deleteAboutMePost,
  editAboutMePost,
}
