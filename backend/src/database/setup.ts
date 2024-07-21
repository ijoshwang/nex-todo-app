import pool from './db'
import { queries } from './queries'
import { seedDuties } from './seed'

const seedData = async () => {
  for (const duty of seedDuties) {
    await pool.query(queries.insertDuty, [duty.name])
  }

  console.log('Database seeded!')
}

const setupDb = async () => {
  try {
    // await pool.query('DROP TABLE IF EXISTS duties');
    await pool.query(queries.createTable)
    console.log('Table created!')
    await seedData()
  } catch (err) {
    console.error('Error setting up the database:', err)
  } finally {
    pool.end()
  }
}

setupDb()
