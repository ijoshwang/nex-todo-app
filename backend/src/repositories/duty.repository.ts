import { queryDatabase } from '../database/db'
import { queries } from '../database/queries'
import { Duty } from '../models/duty.model'

export const getDuties = async (): Promise<Duty[]> => {
  return queryDatabase<Duty>(queries.selectAllDuties, [])
}

export const getDutyById = async (id: string): Promise<Duty | null> => {
  const result = await queryDatabase<Duty>(queries.selectDutyById, [id])

  return result.length === 0 ? null : result[0]
}

export const createDuty = async (name: string): Promise<Duty> => {
  const result = await queryDatabase<Duty>(queries.insertDuty, [name])

  return result[0]
}

export const updateDutyName = async (
  id: string,
  name: string
): Promise<Duty | null> => {
  const result = await queryDatabase<Duty>(queries.updateDutyName, [name, id])

  return result.length === 0 ? null : result[0]
}

export const updateDutyStatus = async (
  id: string,
  is_completed: boolean
): Promise<Duty | null> => {
  const result = await queryDatabase<Duty>(queries.updateDutyStatus, [
    is_completed,
    id,
  ])

  return result.length === 0 ? null : result[0]
}

export const deleteDuty = async (id: string): Promise<Duty | null> => {
  const result = await queryDatabase<Duty>(queries.deleteDuty, [id])

  return result.length === 0 ? null : result[0]
}
