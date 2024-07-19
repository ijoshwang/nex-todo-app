import express from 'express'
import bodyParser from 'body-parser'
import dutyRoutes from './routes/duty.routes'

const app = express()

app.use(bodyParser.json())
app.use('/duties', dutyRoutes)

export default app
