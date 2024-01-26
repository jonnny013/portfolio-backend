import EmailPost from '../models/email'
import { NewEmail } from '../types'

const addEmail = async (email: NewEmail) => {
  const dateAdded = new Date().toString()

  const emailPost = new EmailPost({
    ...email,
    dateAdded,
  })
  const savedAboutMePost = await emailPost.save()
  return savedAboutMePost
}

export default { addEmail }
