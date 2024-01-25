import { Request } from 'express'
import User from '../models/user'
import { UserType } from '../types'


const onLoginSuccess = async (user: UserType, request: Request) => {
  const id = user._id 
  const time = new Date().toString()
  const ipAddress = request.ip as string
  const device = request.get('User-Agent') as string
  const newRecord = {
    time,
    ipAddress,
    device
  }

   await User.findByIdAndUpdate(id, { $push: {loginRecord: newRecord},    $set: { 'accountStatus.failedLoginAttempts': 0 },}, {new: true})
  return 'success'
}


export default {onLoginSuccess}