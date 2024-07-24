import { NextFunction, Request, Response } from 'express'

import { ERROR_MESSAGES } from '../constants/errorMessages'
import CustomError from '../utils/customError'

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
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
