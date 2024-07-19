import { body, param } from 'express-validator'

export const createDutyValidation = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
]

export const updateDutyValidation = [
  param('id').isUUID().withMessage('ID must be a valid UUID'),
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
]

export const getDutyValidation = [
  param('id').isUUID().withMessage('ID must be a valid UUID'),
]

export const deleteDutyValidation = [
  param('id').isUUID().withMessage('ID must be a valid UUID'),
]
