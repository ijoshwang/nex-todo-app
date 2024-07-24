export const ERROR_CODES = {
  VALIDATION_FAILED: 'ERR_VALIDATION_FAILED',
  INVALID_ID: 'ERR_INVALID_ID',
  INVALID_NAME: 'ERR_INVALID_NAME',
  INVALID_IS_COMPLETED: 'ERR_INVALID_IS_COMPLETED',
  INVALID_JSON: 'ERR_INVALID_JSON',
  NOT_FOUND: 'ERR_NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'ERR_INTERNAL_SERVER_ERROR',
}

export const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  INVALID_ID: 'ID must be a valid UUID',
  INVALID_NAME: 'Name must be a string and between 1 and 100 characters',
  INVALID_IS_COMPLETED: 'is_completed must be a boolean',
  INVALID_JSON: 'Invalid JSON',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  UNKNOWN_ERROR: 'Unknown error',
}
