import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getDuties,
  getDutyById,
  createDuty,
  updateDuty,
  deleteDuty,
} from '../controllers/duty.controller'

const router = Router()

// Middleware for validating and sanitizing request data
const validateDuty = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters')
    .escape(),
]

// Routes
router.get('/', getDuties)

router.get(
  '/:id',
  [param('id').isUUID().withMessage('ID must be a valid UUID')],
  getDutyById
)

router.post('/', validateDuty, createDuty)

router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('ID must be a valid UUID'),
    ...validateDuty,
  ],
  updateDuty
)

router.delete(
  '/:id',
  [param('id').isUUID().withMessage('ID must be a valid UUID')],
  deleteDuty
)

export default router
