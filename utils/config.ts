import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_URI_TESTING = process.env.MONGODB_URI_TESTING

export default { PORT, MONGODB_URI, MONGODB_URI_TESTING}