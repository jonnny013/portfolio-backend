import app from './src/app'
import config from './src/utils/config'
import logger from './src/utils/logger'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
