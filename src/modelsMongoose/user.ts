// deno-types="npm:@types/mongoose"
import mongoose from 'mongoose'

interface LoginRecord {
  ipAddress?: string
  device?: string
  time?: Date
}

interface AccountStatus {
  active: boolean
  locked: boolean
  failedLoginAttempts: number
}

export interface UserDocument extends mongoose.Document {
  _id: any;
  username: string
  passwordHash: string
  dateAdded: Date
  loginRecord: LoginRecord[]
  accountStatus: AccountStatus
}

const loginRecordSchema = new mongoose.Schema(
  {
    time: { type: Date },
    ipAddress: String,
    device: String,
  },
  { _id: false, versionKey: false }
)

const accountStatusSchema = new mongoose.Schema(
  {
    active: Boolean,
    locked: Boolean,
    failedLoginAttempts: Number,
  },
  { _id: false, versionKey: false }
)

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 6,
    unique: true,
  },
  passwordHash: String,
  dateAdded: {
    type: Date,
  },
  loginRecord: {
    type: [loginRecordSchema],
  },
  accountStatus: {
    type: accountStatusSchema,
  },
})

userSchema.set('toJSON', {
  transform: (_document: unknown, returnedObject: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id?.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model<UserDocument>('User', userSchema)

export default User
