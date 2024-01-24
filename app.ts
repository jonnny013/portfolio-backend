import express from 'express'
import cors from 'cors'
import config from './utils/config'
import logger from './utils/logger'
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


app.get('/ping', (_req, res) => {
  console.log('someone pinged here')
  res.send('pong')
})




export default app