import { NextFunction, Request, Response } from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'

import { ERROR_CODES, ERROR_MESSAGES } from '../constants/errorMessages'
import {
  createDuty,
  deleteDuty,
  getDuties,
  getDutyById,
  updateDuty,
} from '../controllers/duty.controller'
import { Duty } from '../models/duty.model'
import * as dutyRepository from '../repositories/duty.repository'
import CustomError from '../utils/customError'

// Mocking express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}))

// Define helper functions for creating mock request, response, and next
const mockRequest = <TParams, TBody>(
  params: TParams,
  body: TBody
): Request<TParams, unknown, TBody> => {
  return {
    params,
    body,
  } as unknown as Request<TParams, unknown, TBody>
}

const mockResponse = <T>(): Response<T> => {
  const res = {} as Response<T>
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)

  return res
}

const mockNext: NextFunction = jest.fn()

const handleValidationError = (mockNext: NextFunction, errorMsg: string) => {
  mockNext(
    new CustomError(
      errorMsg,
      400,
      ERROR_CODES.VALIDATION_FAILED,
      JSON.stringify([{ msg: 'Validation error' }])
    )
  )
}

describe('Duty Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDuties', () => {
    it('should return duties successfully', async () => {
      const mockDuties: Duty[] = [
        {
          id: '1',
          name: 'Duty 1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_completed: false,
        },
      ]
      jest.spyOn(dutyRepository, 'getDuties').mockResolvedValue(mockDuties)

      const req = mockRequest<unknown, unknown>({}, {})
      const res = mockResponse<Duty[]>()

      await getDuties(req, res, mockNext)

      expect(res.json).toHaveBeenCalledWith(mockDuties)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Error getting duties')
      jest.spyOn(dutyRepository, 'getDuties').mockRejectedValue(error)

      const req = mockRequest<unknown, unknown>({}, {})
      const res = mockResponse<Duty[]>()

      await getDuties(req, res, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        new CustomError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          500,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          error.message
        )
      )
    })
  })

  describe('getDutyById', () => {
    it('should return a duty successfully', async () => {
      const mockDuty: Duty = {
        id: '1',
        name: 'Duty 1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
      }
      jest.spyOn(dutyRepository, 'getDutyById').mockResolvedValue(mockDuty)

      const req = mockRequest<{ id: string }, unknown>({ id: '1' }, {})
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)

      await getDutyById(req, res, mockNext)

      expect(res.json).toHaveBeenCalledWith(mockDuty)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const req = mockRequest<{ id: string }, unknown>({ id: 'invalid-id' }, {})
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: ERROR_MESSAGES.INVALID_ID }],
      } as unknown as Result<ValidationError>)

      await getDutyById(req, res, mockNext)

      handleValidationError(mockNext, ERROR_MESSAGES.INVALID_ID)
    })

    it('should handle not found errors', async () => {
      jest.spyOn(dutyRepository, 'getDutyById').mockResolvedValue(null)

      const req = mockRequest<{ id: string }, unknown>({ id: '1' }, {})
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)

      await getDutyById(req, res, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        new CustomError(
          ERROR_MESSAGES.NOT_FOUND,
          404,
          ERROR_CODES.NOT_FOUND,
          `Duty with ID 1 not found`
        )
      )
    })

    it('should handle errors', async () => {
      const error = new Error('Error getting duty')
      jest.spyOn(dutyRepository, 'getDutyById').mockRejectedValue(error)

      const req = mockRequest<{ id: string }, unknown>({ id: '1' }, {})
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)

      await getDutyById(req, res, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        new CustomError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          500,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          error.message
        )
      )
    })

    it('should handle invalid ID format', async () => {
      const req = mockRequest<{ id: string }, unknown>({ id: 'invalid-id' }, {})
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: ERROR_MESSAGES.INVALID_ID }],
      } as unknown as Result<ValidationError>)

      await getDutyById(req, res, mockNext)

      handleValidationError(mockNext, ERROR_MESSAGES.INVALID_ID)
    })
  })

  describe('createDuty', () => {
    it('should create a duty successfully', async () => {
      const mockDuty: Duty = {
        id: '1',
        name: 'Duty 1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
      }
      jest.spyOn(dutyRepository, 'createDuty').mockResolvedValue(mockDuty)
      const req = mockRequest<Record<string, unknown>, { name: string }>(
        {},
        { name: 'Duty 1' }
      )
      const res = mockResponse<Duty>()
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)
      await createDuty(req, res, mockNext)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockDuty)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const req = mockRequest<Record<string, unknown>, { name: string }>(
        {},
        { name: '' }
      )
      const res = mockResponse<Duty>()
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: ERROR_MESSAGES.INVALID_NAME }],
      } as unknown as Result<ValidationError>)
      await createDuty(req, res, mockNext)
      handleValidationError(mockNext, ERROR_MESSAGES.INVALID_NAME)
    })

    it('should handle repository errors', async () => {
      const error = new Error('Repository error')
      jest.spyOn(dutyRepository, 'createDuty').mockRejectedValue(error)
      const req = mockRequest<Record<string, unknown>, { name: string }>(
        {},
        { name: 'Duty 1' }
      )
      const res = mockResponse<Duty>()
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)
      await createDuty(req, res, mockNext)
      expect(mockNext).toHaveBeenCalledWith(
        new CustomError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          500,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          error.message
        )
      )
    })

    it('should handle empty name', async () => {
      const req = mockRequest<Record<string, unknown>, { name: string }>(
        {},
        { name: '' }
      )
      const res = mockResponse<Duty>()
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: ERROR_MESSAGES.INVALID_NAME }],
      } as unknown as Result<ValidationError>)
      await createDuty(req, res, mockNext)
      handleValidationError(mockNext, ERROR_MESSAGES.INVALID_NAME)
    })

    it('should handle very long name', async () => {
      const longName = 'a'.repeat(101)
      const req = mockRequest<Record<string, unknown>, { name: string }>(
        {},
        { name: longName }
      )
      const res = mockResponse<Duty>()
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: ERROR_MESSAGES.INVALID_NAME }],
      } as unknown as Result<ValidationError>)
      await createDuty(req, res, mockNext)
      handleValidationError(mockNext, ERROR_MESSAGES.INVALID_NAME)
    })
  })

  describe('updateDuty', () => {
    it('should update a duty name successfully', async () => {
      const mockDuty: Duty = {
        id: '1',
        name: 'Updated Duty',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
      }
      jest.spyOn(dutyRepository, 'updateDutyName').mockResolvedValue(mockDuty)

      const req = mockRequest<{ id: string }, { name: string }>(
        { id: '1' },
        { name: 'Updated Duty' }
      )
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)

      await updateDuty(req, res, mockNext)

      expect(res.json).toHaveBeenCalledWith(mockDuty)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should update a duty status successfully', async () => {
      const mockDuty: Duty = {
        id: '1',
        name: 'Duty 1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: true,
      }
      jest.spyOn(dutyRepository, 'updateDutyStatus').mockResolvedValue(mockDuty)

      const req = mockRequest<{ id: string }, { is_completed: boolean }>(
        { id: '1' },
        { is_completed: true }
      )
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)

      await updateDuty(req, res, mockNext)

      expect(res.json).toHaveBeenCalledWith(mockDuty)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const req = mockRequest<{ id: string }, { name: string }>(
        { id: 'invalid-id' },
        { name: '' }
      )
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: ERROR_MESSAGES.INVALID_ID }],
      } as unknown as Result<ValidationError>)

      await updateDuty(req, res, mockNext)

      handleValidationError(mockNext, ERROR_MESSAGES.INVALID_ID)
    })

    it('should handle not found errors', async () => {
      jest.spyOn(dutyRepository, 'updateDutyName').mockResolvedValue(null)

      const req = mockRequest<{ id: string }, { name: string }>(
        { id: '1' },
        { name: 'Updated Duty' }
      )
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)

      await updateDuty(req, res, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        new CustomError(
          ERROR_MESSAGES.NOT_FOUND,
          404,
          ERROR_CODES.NOT_FOUND,
          `Duty with ID 1 not found`
        )
      )
    })

    it('should handle errors', async () => {
      const error = new Error('Error updating duty')
      jest.spyOn(dutyRepository, 'updateDutyName').mockRejectedValue(error)

      const req = mockRequest<{ id: string }, { name: string }>(
        { id: '1' },
        { name: 'Updated Duty' }
      )
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)

      await updateDuty(req, res, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        new CustomError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          500,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          error.message
        )
      )
    })

    it('should handle both name and is_completed being provided', async () => {
      const mockDuty: Duty = {
        id: '1',
        name: 'Updated Duty',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: true,
      }
      jest.spyOn(dutyRepository, 'updateDutyName').mockResolvedValue(mockDuty)

      const req = mockRequest<
        { id: string },
        { name: string; is_completed: boolean }
      >({ id: '1' }, { name: 'Updated Duty', is_completed: true })
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)

      await updateDuty(req, res, mockNext)

      expect(res.json).toHaveBeenCalledWith(mockDuty)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle neither name nor is_completed being provided', async () => {
      const req = mockRequest<
        { id: string },
        { name?: string; is_completed?: boolean }
      >({ id: '1' }, {})
      const res = mockResponse<Duty>()

      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: ERROR_MESSAGES.INVALID_NAME }],
      } as unknown as Result<ValidationError>)

      await updateDuty(req, res, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        new CustomError(
          ERROR_MESSAGES.INVALID_NAME,
          400,
          ERROR_CODES.INVALID_NAME,
          JSON.stringify([
            { msg: 'Either name or is_completed must be provided' },
          ])
        )
      )
    })
  })

  describe('deleteDuty', () => {
    it('should delete a duty successfully', async () => {
      const mockDuty: Duty = {
        id: '1',
        name: 'Duty 1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
      }
      jest.spyOn(dutyRepository, 'deleteDuty').mockResolvedValue(mockDuty)
      const req = mockRequest<{ id: string }, unknown>({ id: '1' }, {})
      const res = mockResponse<null>()
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)
      await deleteDuty(req, res, mockNext)
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const req = mockRequest<{ id: string }, unknown>({ id: 'invalid-id' }, {})
      const res = mockResponse<null>()
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: ERROR_MESSAGES.INVALID_ID }],
      } as unknown as Result<ValidationError>)
      await deleteDuty(req, res, mockNext)
      handleValidationError(mockNext, ERROR_MESSAGES.INVALID_ID)
    })

    it('should handle not found errors', async () => {
      jest.spyOn(dutyRepository, 'deleteDuty').mockResolvedValue(null)
      const req = mockRequest<{ id: string }, unknown>({ id: '1' }, {})
      const res = mockResponse<null>()
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)
      await deleteDuty(req, res, mockNext)
      expect(mockNext).toHaveBeenCalledWith(
        new CustomError(
          ERROR_MESSAGES.NOT_FOUND,
          404,
          ERROR_CODES.NOT_FOUND,
          `Duty with ID 1 not found`
        )
      )
    })

    it('should handle repository errors', async () => {
      const error = new Error('Repository error')
      jest.spyOn(dutyRepository, 'deleteDuty').mockRejectedValue(error)
      const req = mockRequest<{ id: string }, unknown>({ id: '1' }, {})
      const res = mockResponse<null>()
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as unknown as Result<ValidationError>)
      await deleteDuty(req, res, mockNext)
      expect(mockNext).toHaveBeenCalledWith(
        new CustomError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          500,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          error.message
        )
      )
    })

    it('should handle invalid ID format', async () => {
      const req = mockRequest<{ id: string }, unknown>({ id: 'invalid-id' }, {})
      const res = mockResponse<null>()
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: ERROR_MESSAGES.INVALID_ID }],
      } as unknown as Result<ValidationError>)
      await deleteDuty(req, res, mockNext)
      handleValidationError(mockNext, ERROR_MESSAGES.INVALID_ID)
    })
  })
})
