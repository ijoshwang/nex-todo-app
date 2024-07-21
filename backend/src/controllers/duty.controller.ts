import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import { ERROR_CODES, ERROR_MESSAGES } from '../constants/errorMessages'
import {
  createDuty as createDutyRepo,
  deleteDuty as deleteDutyRepo,
  getDuties as getDutiesRepo,
  getDutyById as getDutyByIdRepo,
  updateDuty as updateDutyRepo,
} from '../repositories/duty.repository'
import CustomError from '../utils/customError'
import logger from '../utils/logger'

export const getDuties = async (
  req: Request,
  res: Response,
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(
      new CustomError(
        ERROR_MESSAGES.VALIDATION_FAILED,
        400,
        ERROR_CODES.VALIDATION_FAILED,
        JSON.stringify(errors.array())
      )
    )
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(
      new CustomError(
        ERROR_MESSAGES.VALIDATION_FAILED,
        400,
        ERROR_CODES.VALIDATION_FAILED,
        JSON.stringify(errors.array())
      )
    )
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(
      new CustomError(
        ERROR_MESSAGES.VALIDATION_FAILED,
        400,
        ERROR_CODES.VALIDATION_FAILED,
        JSON.stringify(errors.array())
      )
    )
  }

  const { id } = req.params
  const { name, is_completed } = req.body

  try {
    const duty = await updateDutyRepo(id, name || is_completed)

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(
      new CustomError(
        ERROR_MESSAGES.VALIDATION_FAILED,
        400,
        ERROR_CODES.VALIDATION_FAILED,
        JSON.stringify(errors.array())
      )
    )
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
