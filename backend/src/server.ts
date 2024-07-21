import logger from './utils/logger'
import app from './app'
import config from './config'

const port = config.port

app.listen(port, () => {
  logger.info(`Server running on port ${port}`)
})
