import express from 'express'
import bodyParser from 'body-parser'
import dutyRoutes from './routes/duty.routes'
import errorHandler from './middlewares/errorHandler'

const app = express()

app.use(bodyParser.json())
app.use('/duties', dutyRoutes)
app.use(errorHandler) // Add the error-handling middleware

export default app
