import 'dotenv/config'

const PORT = Number(process.env.PORT) || 3001
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TESTING
    : process.env.MONGODB_URI

const SECRET: string | undefined = process.env.SECRET

export default { PORT, MONGODB_URI, SECRET }
