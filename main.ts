import app from './src/app.ts'
import config from './src/config/config.ts'
import logger from './src/utils/logger.ts'
//import { connectToDatabase } from './src/db/db.ts'

const start =  () => {
 // await connectToDatabase()
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  })
}
void start()
