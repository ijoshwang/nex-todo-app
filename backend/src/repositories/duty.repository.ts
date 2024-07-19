import pool from '../database/db'
import { Duty } from '../models/duty.model'
import { queries } from '../database/queries'

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

export const updateDuty = async (
  id: string,
  name: string
): Promise<Duty | null> => {
  const result = await pool.query(queries.updateDuty, [name, id])
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
