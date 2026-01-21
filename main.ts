import app from './src/app'
import config from './src/config/config'
import logger from './src/utils/logger'
//import { connectToDatabase } from './src/db/db.ts'

const start =  () => {
 // await connectToDatabase()
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  })
}
void start()
