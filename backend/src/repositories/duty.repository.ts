import pool from '../database/db'
import { queries } from '../database/queries'
import { Duty } from '../models/duty.model'

export const getDuties = async (): Promise<Duty[]> => {
  const result = await pool.query(queries.selectAllDuties)

  return result.rows
}

export const getDutyById = async (id: string): Promise<Duty | null> => {
  const result = await pool.query(queries.selectDutyById, [id])

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0]
}

export const createDuty = async (name: string): Promise<Duty> => {
  const result = await pool.query(queries.insertDuty, [name])

  return result.rows[0]
}

export const updateDutyName = async (
  id: string,
  name: string
): Promise<Duty | null> => {
  const result = await pool.query(queries.updateDutyName, [name, id])

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0]
}

export const updateDutyStatus = async (
  id: string,
  is_completed: boolean
): Promise<Duty | null> => {
  const result = await pool.query(queries.updateDutyStatus, [is_completed, id])

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0]
}

export const deleteDuty = async (id: string): Promise<Duty | null> => {
  const result = await pool.query(queries.deleteDuty, [id])

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0]
}
