import { Request, Response, NextFunction } from 'express'
import CustomError from '../utils/customError'
import { ERROR_MESSAGES } from '../constants/errorMessages'

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500
  const errorCode = err.errorCode || 'ERR_INTERNAL_SERVER_ERROR'
  const response = {
    status: 'error',
    error_code: errorCode,
    message: err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    details: err.details || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  }

  res.status(statusCode).json(response)
}

export default errorHandler
