import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

import errorHandler from './middlewares/errorHandler'
import dutyRoutes from './routes/duty.routes'
import config from './config'

const app = express()

app.use(
  cors({
    origin: config.client.url,
    credentials: true,
  })
)

app.use(bodyParser.json())
app.use(`${config.api}/duties`, dutyRoutes)
app.use(errorHandler)

export default app
