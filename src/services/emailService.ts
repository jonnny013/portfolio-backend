import EmailPost from "../models/email.ts"
import { Request } from 'express'
import { NewEmail } from "../types.d.ts"

const addEmail = async ({email, request}: {email: NewEmail, request: Request}) => {
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
    senderInfo: newRecord
  })
  const savedAboutMePost = await emailPost.save()
  return savedAboutMePost
}

export default { addEmail }
