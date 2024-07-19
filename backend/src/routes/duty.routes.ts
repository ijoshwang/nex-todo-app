import { Router } from 'express'
import {
  getDuties,
  getDutyById,
  createDuty,
  updateDuty,
  deleteDuty,
} from '../controllers/duty.controller'
import {
  createDutyValidation,
  updateDutyValidation,
  getDutyValidation,
  deleteDutyValidation,
} from '../validators/duty.validation'

const router = Router()

router.get('/', getDuties)
router.get('/:id', getDutyValidation, getDutyById)
router.post('/', createDutyValidation, createDuty)
router.put('/:id', updateDutyValidation, updateDuty)
router.delete('/:id', deleteDutyValidation, deleteDuty)

export default router
