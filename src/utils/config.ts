import dotenv from 'dotenv'
import { GetPublicKeyOrSecret, Secret } from 'jsonwebtoken'
dotenv.config()

const PORT = process.env.PORT
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TESTING
    : process.env.MONGODB_URI

const SECRET: Secret | GetPublicKeyOrSecret | undefined = process.env.SECRET

export default { PORT, MONGODB_URI, SECRET}