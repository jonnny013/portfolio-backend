import app from './src/app.js'
import config from './src/config/config.js'
import logger from './src/utils/logger.js'
//import { connectToDatabase } from './src/db/db.ts'

const start =  () => {
 // await connectToDatabase()
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  })
}
void start()
