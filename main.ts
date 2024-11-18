import app from "./src/app.ts"
import config from "./src/config/config.ts"
import logger from "./src/utils/logger.ts"

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
