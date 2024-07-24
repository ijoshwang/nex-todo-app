import pool from './db'
import { queries } from './queries'
import { seedDuties } from './seed'

const seedData = async () => {
  // Check if the duties table is empty
  const result = await pool.query(queries.selectAllDuties)

  if (result.rows.length === 0) {
    // If the table is empty, insert seed data
    for (const duty of seedDuties) {
      await pool.query(queries.insertDuty, [duty.name])
    }

    console.log('Database seeded!')
  } else {
    console.log('Duties table already contains data. Skipping seeding.')
  }
}

const setupDb = async () => {
  try {
    // await pool.query(queries.dropTable)
    // console.log('Table droped!')
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
