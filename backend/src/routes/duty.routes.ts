import { Router } from 'express'

import {
  createDuty,
  deleteDuty,
  getDuties,
  getDutyById,
  updateDuty,
} from '../controllers/duty.controller'
import {
  createDutyValidation,
  deleteDutyValidation,
  getDutyValidation,
  updateDutyNameValidation,
  updateDutyStatusValidation,
} from '../validators/duty.validation'

const router = Router()

router.get('/', getDuties)
router.get('/:id', getDutyValidation, getDutyById)
router.post('/', createDutyValidation, createDuty)
router.put('/:id', updateDutyNameValidation, updateDuty)
router.put('/:id/status', updateDutyStatusValidation, updateDuty)
router.delete('/:id', deleteDutyValidation, deleteDuty)

export default router
