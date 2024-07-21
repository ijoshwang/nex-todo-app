import dotenv from 'dotenv'

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
console.log('🚀 ~ envFile:', envFile)
dotenv.config({ path: envFile })

const config = {
  port: process.env.PORT || 3000,
  api: process.env.API_PATH,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
  },
  client: {
    url: process.env.CLIENT_URL,
  },
}

export default config
