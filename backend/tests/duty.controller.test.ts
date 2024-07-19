import request from 'supertest'
import app from '../src/app'
import { ERROR_CODES } from '../src/constants/errorMessages'
import {
  getDuties,
  getDutyById,
  createDuty,
  updateDuty,
  deleteDuty,
} from '../src/repositories/duty.repository'

jest.mock('../src/repositories/duty.repository')

const mockGetDuties = getDuties as jest.Mock
const mockGetDutyById = getDutyById as jest.Mock
const mockCreateDuty = createDuty as jest.Mock
const mockUpdateDuty = updateDuty as jest.Mock
const mockDeleteDuty = deleteDuty as jest.Mock

describe('Duties API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /duties', () => {
    it('should return an empty array if no duties are found', async () => {
      mockGetDuties.mockResolvedValueOnce([])
      const response = await request(app).get('/duties')
      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('should return an array of duties if duties exist', async () => {
      mockGetDuties.mockResolvedValueOnce([
        { id: '1', name: 'Duty 1' },
        { id: '2', name: 'Duty 2' },
      ])
      const response = await request(app).get('/duties')
      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(2)
      expect(response.body[0].name).toBe('Duty 1')
      expect(response.body[1].name).toBe('Duty 2')
    })

    it('should handle internal server error', async () => {
      mockGetDuties.mockRejectedValueOnce(new Error('Database error'))
      const response = await request(app).get('/duties')
      expect(response.status).toBe(500)
      expect(response.body.error_code).toBe(ERROR_CODES.INTERNAL_SERVER_ERROR)
    })
  })

  describe('GET /duties/:id', () => {
    it('should return a duty if a valid ID is provided', async () => {
      mockGetDutyById.mockResolvedValueOnce({ id: '1', name: 'Duty 1' })
      const response = await request(app).get('/duties/1')
      expect(response.status).toBe(200)
      expect(response.body.name).toBe('Duty 1')
    })

    it('should return a validation error if the ID is not a valid UUID', async () => {
      const response = await request(app).get('/duties/invalid-id')
      expect(response.status).toBe(400)
      expect(response.body.error_code).toBe(ERROR_CODES.VALIDATION_FAILED)
    })

    it('should return a not found error if no duty exists with the provided ID', async () => {
      mockGetDutyById.mockResolvedValueOnce(null)
      const response = await request(app).get(
        '/duties/00000000-0000-0000-0000-000000000000'
      )
      expect(response.status).toBe(404)
      expect(response.body.error_code).toBe(ERROR_CODES.NOT_FOUND)
    })

    it('should handle internal server error', async () => {
      mockGetDutyById.mockRejectedValueOnce(new Error('Database error'))
      const response = await request(app).get(
        '/duties/00000000-0000-0000-0000-000000000000'
      )
      expect(response.status).toBe(500)
      expect(response.body.error_code).toBe(ERROR_CODES.INTERNAL_SERVER_ERROR)
    })
  })

  describe('POST /duties', () => {
    it('should create and return a new duty if valid data is provided', async () => {
      mockCreateDuty.mockResolvedValueOnce({ id: '1', name: 'New Duty' })
      const response = await request(app)
        .post('/duties')
        .send({ name: 'New Duty' })
      expect(response.status).toBe(201)
      expect(response.body.name).toBe('New Duty')
    })

    it('should return a validation error if the name is missing or invalid', async () => {
      const response = await request(app).post('/duties').send({})
      expect(response.status).toBe(400)
      expect(response.body.error_code).toBe(ERROR_CODES.VALIDATION_FAILED)
    })

    it('should handle internal server error', async () => {
      mockCreateDuty.mockRejectedValueOnce(new Error('Database error'))
      const response = await request(app)
        .post('/duties')
        .send({ name: 'New Duty' })
      expect(response.status).toBe(500)
      expect(response.body.error_code).toBe(ERROR_CODES.INTERNAL_SERVER_ERROR)
    })
  })

  describe('PUT /duties/:id', () => {
    it('should update and return the duty if valid data is provided', async () => {
      mockUpdateDuty.mockResolvedValueOnce({ id: '1', name: 'Updated Duty' })
      const response = await request(app)
        .put('/duties/1')
        .send({ name: 'Updated Duty' })
      expect(response.status).toBe(200)
      expect(response.body.name).toBe('Updated Duty')
    })

    it('should return a validation error if the ID is not a valid UUID', async () => {
      const response = await request(app)
        .put('/duties/invalid-id')
        .send({ name: 'Updated Duty' })
      expect(response.status).toBe(400)
      expect(response.body.error_code).toBe(ERROR_CODES.VALIDATION_FAILED)
    })

    it('should return a validation error if the name is missing or invalid', async () => {
      const response = await request(app).put('/duties/1').send({})
      expect(response.status).toBe(400)
      expect(response.body.error_code).toBe(ERROR_CODES.VALIDATION_FAILED)
    })

    it('should return a not found error if no duty exists with the provided ID', async () => {
      mockUpdateDuty.mockResolvedValueOnce(null)
      const response = await request(app)
        .put('/duties/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Updated Duty' })
      expect(response.status).toBe(404)
      expect(response.body.error_code).toBe(ERROR_CODES.NOT_FOUND)
    })

    it('should handle internal server error', async () => {
      mockUpdateDuty.mockRejectedValueOnce(new Error('Database error'))
      const response = await request(app)
        .put('/duties/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Updated Duty' })
      expect(response.status).toBe(500)
      expect(response.body.error_code).toBe(ERROR_CODES.INTERNAL_SERVER_ERROR)
    })
  })

  describe('DELETE /duties/:id', () => {
    it('should delete the duty if a valid ID is provided', async () => {
      mockDeleteDuty.mockResolvedValueOnce({ id: '1', name: 'Duty 1' })
      const response = await request(app).delete('/duties/1')
      expect(response.status).toBe(204)
    })

    it('should return a validation error if the ID is not a valid UUID', async () => {
      const response = await request(app).delete('/duties/invalid-id')
      expect(response.status).toBe(400)
      expect(response.body.error_code).toBe(ERROR_CODES.VALIDATION_FAILED)
    })

    it('should return a not found error if no duty exists with the provided ID', async () => {
      mockDeleteDuty.mockResolvedValueOnce(null)
      const response = await request(app).delete(
        '/duties/00000000-0000-0000-0000-000000000000'
      )
      expect(response.status).toBe(404)
      expect(response.body.error_code).toBe(ERROR_CODES.NOT_FOUND)
    })

    it('should handle internal server error', async () => {
      mockDeleteDuty.mockRejectedValueOnce(new Error('Database error'))
      const response = await request(app).delete(
        '/duties/00000000-0000-0000-0000-000000000000'
      )
      expect(response.status).toBe(500)
      expect(response.body.error_code).toBe(ERROR_CODES.INTERNAL_SERVER_ERROR)
    })
  })
})
