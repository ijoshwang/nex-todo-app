import request from 'supertest'

import app from '../app'
import config from '../config'
import pool from '../database/db'
import { queries } from '../database/queries'

const basePath = config.api + '/duties'

beforeAll(async () => {
  await pool.query(queries.dropTable)
  await pool.query(queries.createTable)
})

afterAll(async () => {
  await pool.query(queries.dropTable)
  await pool.end()
})

describe('Duties API', () => {
  let dutyId: string

  it('should create a new duty', async () => {
    const response = await request(app)
      .post(basePath)
      .send({ name: 'Test Duty' })
      .expect(201)

    dutyId = response.body.id
    expect(response.body.name).toBe('Test Duty')
    expect(response.body.is_completed).toBe(false)
  })

  it('should get all duties', async () => {
    const response = await request(app).get(basePath).expect(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0].name).toBe('Test Duty')
  })

  it('should get a duty by ID', async () => {
    const response = await request(app).get(`${basePath}/${dutyId}`).expect(200)
    expect(response.body.name).toBe('Test Duty')
  })

  // Error and edge case tests
  it('should return 404 for non-existent duty ID', async () => {
    await request(app)
      .get(`${basePath}/00000000-0000-0000-0000-000000000000`)
      .expect(404)
  })

  it('should return 400 for invalid duty creation', async () => {
    await request(app)
      .post(basePath)
      .send({ name: '' }) // Invalid name
      .expect(400)
  })

  it('should return 400 for invalid duty update', async () => {
    await request(app)
      .put(`${basePath}/${dutyId}`)
      .send({ name: '' }) // Invalid name
      .expect(400)
  })

  it('should return 404 for updating non-existent duty', async () => {
    await request(app)
      .put(`${basePath}/00000000-0000-0000-0000-000000000000`)
      .send({ name: 'Updated Test Duty' })
      .expect(404)
  })

  it('should update a duty name', async () => {
    const response = await request(app)
      .put(`${basePath}/${dutyId}`)
      .send({ name: 'Updated Test Duty' })
      .expect(200)

    expect(response.body.name).toBe('Updated Test Duty')
  })

  it('should update a duty status', async () => {
    const response = await request(app)
      .put(`${basePath}/${dutyId}`)
      .send({ is_completed: true })

    expect(response.body.is_completed).toBe(true)
  })

  it('should delete a duty', async () => {
    await request(app).delete(`${basePath}/${dutyId}`).expect(204)
  })

  it('should return 404 for deleting non-existent duty', async () => {
    await request(app)
      .delete(`${basePath}/00000000-0000-0000-0000-000000000000`)
      .expect(404)
  })
})
