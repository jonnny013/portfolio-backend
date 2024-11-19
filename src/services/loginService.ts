import type { Request } from 'npm:express'
import User, { UserDocument } from "../models/user.ts"

const onLoginSuccess = async (user: UserDocument, request: Request) => {
  const id = user._id
  const time = new Date().toString()
  const ipAddress = request.ip as string
  const device = request.get('User-Agent') as string
  const newRecord = {
    time,
    ipAddress,
    device,
  }

  await User.findByIdAndUpdate(
    id,
    {
      $push: { loginRecord: newRecord },
      $set: { 'accountStatus.failedLoginAttempts': 0 },
    },
    { new: true }
  )
  return 'success'
}

const MAX_FAILED_ATTEMPTS = 4

const onFailedLogin = async (user: UserDocument, request: Request) => {
  const id = user._id
  const time = new Date().toString()
  const ipAddress = request.ip as string
  const device = request.get('User-Agent') as string
  const newRecord = {
    time,
    ipAddress,
    device,
  }

  if (
    user &&
    user.accountStatus &&
    user.accountStatus.failedLoginAttempts >= MAX_FAILED_ATTEMPTS
  ) {
    await User.findByIdAndUpdate(
      id,
      {
        $push: { loginRecord: newRecord },
        $set: { 'accountStatus.locked': true },
      },
      { new: true }
    )
  } else {
    await User.findByIdAndUpdate(
      id,
      {
        $push: { loginRecord: newRecord },
        $inc: { 'accountStatus.failedLoginAttempts': 1 },
      },
      { new: true }
    )
  }
  return 'success'
}

export default { onLoginSuccess, onFailedLogin }
