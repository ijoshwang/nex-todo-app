class CustomError extends Error {
  statusCode: number
  errorCode: string
  details: string | null

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    details: string | null = null
  ) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.details = details

    Error.captureStackTrace(this, this.constructor)
  }
}

export default CustomError
