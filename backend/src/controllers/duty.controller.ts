import { NextFunction, Request, Response } from 'express'
import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator'

import { Duty } from '@/models/duty.model'

import { ERROR_CODES, ERROR_MESSAGES } from '../constants/errorMessages'
import {
  createDuty as createDutyRepo,
  deleteDuty as deleteDutyRepo,
  getDuties as getDutiesRepo,
  getDutyById as getDutyByIdRepo,
  updateDutyName as updateDutyNameRepo,
  updateDutyStatus as updateDutyStatusRepo,
} from '../repositories/duty.repository'
import CustomError from '../utils/customError'
import logger from '../utils/logger'

type ReqParams<T> = Request<T>
type ReqBody<T> = Request<Record<string, unknown>, unknown, T>
type ResBody<T> = Response<T>
// Define the FieldValidationError interface to match the actual structure
// Define the FieldValidationError interface to match the actual structure
interface CustomFieldValidationError extends FieldValidationError {
  param: string
}

// Type guard to check if ValidationError is a CustomFieldValidationError
const isFieldValidationError = (
  error: ValidationError
): error is CustomFieldValidationError => {
  return (error as CustomFieldValidationError).param !== undefined
}

const getValidationError = (error: ValidationError) => {
  if (!isFieldValidationError(error)) {
    return new CustomError(
      error.msg,
      400,
      ERROR_CODES.VALIDATION_FAILED,
      JSON.stringify({ error: error.msg })
    )
  }

  switch (error.param) {
    case 'id':
      return new CustomError(
        ERROR_MESSAGES.INVALID_ID,
        400,
        ERROR_CODES.INVALID_ID,
        JSON.stringify(error)
      )
    case 'name':
      return new CustomError(
        ERROR_MESSAGES.INVALID_NAME,
        400,
        ERROR_CODES.INVALID_NAME,
        JSON.stringify(error)
      )
    case 'is_completed':
      return new CustomError(
        ERROR_MESSAGES.INVALID_IS_COMPLETED,
        400,
        ERROR_CODES.INVALID_IS_COMPLETED,
        JSON.stringify(error)
      )
    default:
      return new CustomError(
        error.msg,
        400,
        ERROR_CODES.VALIDATION_FAILED,
        JSON.stringify(error)
      )
  }
}

export const getDuties = async (
  req: ReqParams<unknown>,
  res: ResBody<Duty[]>,
  next: NextFunction
) => {
  try {
    const duties = await getDutiesRepo()
    res.json(duties) // Will return [] if there are no duties
  } catch (err) {
    const errorMessage = (err as Error).message || ERROR_MESSAGES.UNKNOWN_ERROR
    logger.error('Error getting duties:', errorMessage)
    next(
      new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        500,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        errorMessage
      )
    )
  }
}

export const getDutyById = async (
  req: ReqParams<{ id: string }>,
  res: ResBody<Duty>,
  next: NextFunction
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0]

    return next(getValidationError(firstError))
  }

  const { id } = req.params

  try {
    const duty = await getDutyByIdRepo(id)

    if (!duty) {
      return next(
        new CustomError(
          ERROR_MESSAGES.NOT_FOUND,
          404,
          ERROR_CODES.NOT_FOUND,
          `Duty with ID ${id} not found`
        )
      )
    }

    res.json(duty)
  } catch (err) {
    const errorMessage = (err as Error).message || ERROR_MESSAGES.UNKNOWN_ERROR
    logger.error(`Error getting duty with ID ${id}:`, errorMessage)
    next(
      new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        500,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        errorMessage
      )
    )
  }
}

export const createDuty = async (
  req: ReqBody<{ name: string }>,
  res: ResBody<Duty>,
  next: NextFunction
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0]

    return next(getValidationError(firstError))
  }

  const { name } = req.body

  try {
    const duty = await createDutyRepo(name)
    res.status(201).json(duty)
  } catch (err) {
    const errorMessage = (err as Error).message || ERROR_MESSAGES.UNKNOWN_ERROR
    logger.error('Error creating duty:', errorMessage)
    next(
      new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        500,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        errorMessage
      )
    )
  }
}

export const updateDuty = async (
  req: ReqParams<{ id: string }> &
    ReqBody<{ name?: string; is_completed?: boolean }>,
  res: ResBody<Duty>,
  next: NextFunction
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0]

    return next(getValidationError(firstError))
  }

  const { id } = req.params
  const { name, is_completed } = req.body

  try {
    const duty =
      name !== undefined
        ? await updateDutyNameRepo(id, name)
        : await updateDutyStatusRepo(id, is_completed!)

    if (!duty) {
      return next(
        new CustomError(
          ERROR_MESSAGES.NOT_FOUND,
          404,
          ERROR_CODES.NOT_FOUND,
          `Duty with ID ${id} not found`
        )
      )
    }

    res.json(duty)
  } catch (err) {
    const errorMessage = (err as Error).message || ERROR_MESSAGES.UNKNOWN_ERROR
    logger.error(`Error updating duty with ID ${id}:`, errorMessage)
    next(
      new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        500,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        errorMessage
      )
    )
  }
}

export const deleteDuty = async (
  req: ReqParams<{ id: string }>,
  res: ResBody<null>,
  next: NextFunction
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0]

    return next(getValidationError(firstError))
  }

  const { id } = req.params

  try {
    const duty = await deleteDutyRepo(id)

    if (!duty) {
      return next(
        new CustomError(
          ERROR_MESSAGES.NOT_FOUND,
          404,
          ERROR_CODES.NOT_FOUND,
          `Duty with ID ${id} not found`
        )
      )
    }

    res.status(204).send()
  } catch (err) {
    const errorMessage = (err as Error).message || ERROR_MESSAGES.UNKNOWN_ERROR
    logger.error(`Error deleting duty with ID ${id}:`, errorMessage)
    next(
      new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        500,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        errorMessage
      )
    )
  }
}
