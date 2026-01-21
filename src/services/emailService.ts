import EmailPost from '../modelsMongoose/email.js'
import type { Request } from 'express'
import { NewEmail } from '../types.js'

const addEmail = async ({ email, request }: { email: NewEmail; request: Request }) => {
  const dateAdded = new Date().toString()
  const time = new Date().toString()
  const ipAddress = request.ip as string
  const device = request.get('User-Agent') as string
  const newRecord = {
    time,
    ipAddress,
    device,
  }

  const emailPost = new EmailPost({
    ...email,
    dateAdded,
    senderInfo: newRecord,
  })
  const savedAboutMePost = await emailPost.save()
  return savedAboutMePost
}

export default { addEmail }
