import express from 'express'
import config from './utils/config'
import logger from './utils/logger'
const app = express()
app.use(express.json())


app.get('/ping', (_req, res) => {
  console.log('someone pinged here')
  res.send('pong')
})




export default app