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
  updateDutyValidation,
} from '../validators/duty.validation'

const router = Router()

router.get('/', getDuties)
router.get('/:id', getDutyValidation, getDutyById)
router.post('/', createDutyValidation, createDuty)
router.put('/:id', updateDutyValidation, updateDuty)
router.delete('/:id', deleteDutyValidation, deleteDuty)

export default router
