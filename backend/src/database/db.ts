import { Pool } from 'pg'

import config from '../config'

console.log(config.db)

const pool = new Pool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
})

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export default pool
