import app from "./app";
import config from './utils/config'
import logger from "./utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})