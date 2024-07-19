import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import logger from '../utils/logger'
import {
  getDuties as getDutiesRepo,
  getDutyById as getDutyByIdRepo,
  createDuty as createDutyRepo,
  updateDuty as updateDutyRepo,
  deleteDuty as deleteDutyRepo,
} from '../repositories/duty.repository'

export const getDuties = async (req: Request, res: Response) => {
  try {
    const duties = await getDutiesRepo()
    res.json(duties)
  } catch (err) {
    logger.error('Error getting duties:', err)
    res.status(500).send(err)
  }
}

export const getDutyById = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params
  try {
    const duty = await getDutyByIdRepo(id)
    if (!duty) {
      return res.status(404).send('Duty not found')
    }
    res.json(duty)
  } catch (err) {
    logger.error(`Error getting duty with ID ${id}:`, err)
    res.status(500).send(err)
  }
}

export const createDuty = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name } = req.body
  try {
    const duty = await createDutyRepo(name)
    res.status(201).json(duty)
  } catch (err) {
    logger.error('Error creating duty:', err)
    res.status(500).send(err)
  }
}

export const updateDuty = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params
  const { name } = req.body
  try {
    const duty = await updateDutyRepo(id, name)
    if (!duty) {
      return res.status(404).send('Duty not found')
    }
    res.json(duty)
  } catch (err) {
    logger.error(`Error updating duty with ID ${id}:`, err)
    res.status(500).send(err)
  }
}

export const deleteDuty = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params
  try {
    const duty = await deleteDutyRepo(id)
    if (!duty) {
      return res.status(404).send('Duty not found')
    }
    res.status(204).send()
  } catch (err) {
    logger.error(`Error deleting duty with ID ${id}:`, err)
    res.status(500).send(err)
  }
}
