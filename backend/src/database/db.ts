import { Pool, QueryResultRow } from 'pg'

import config from '../config'

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

export const queryDatabase = async <T extends QueryResultRow>(
  query: string,
  values: unknown[]
): Promise<T[]> => {
  const result = await pool.query<T>(query, values)

  return result.rows
}

export default pool
