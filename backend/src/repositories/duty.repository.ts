import { queryDatabase } from '../database/db'
import { queries } from '../database/queries'
import { Duty } from '../models/duty.model'

export const getDuties = async (): Promise<Duty[]> => {
  try {
    return await queryDatabase<Duty>(queries.selectAllDuties, [])
  } catch (error) {
    throw new Error(`Failed to get duties: ${(error as Error).message}`)
  }
}

export const getDutyById = async (id: string): Promise<Duty | null> => {
  try {
    const result = await queryDatabase<Duty>(queries.selectDutyById, [id])

    return result.length === 0 ? null : result[0]
  } catch (error) {
    throw new Error(`Failed to get duty by ID: ${(error as Error).message}`)
  }
}

export const createDuty = async (name: string): Promise<Duty> => {
  try {
    const result = await queryDatabase<Duty>(queries.insertDuty, [name])

    return result[0]
  } catch (error) {
    throw new Error(`Failed to create duty: ${(error as Error).message}`)
  }
}

export const updateDutyName = async (
  id: string,
  name: string
): Promise<Duty | null> => {
  try {
    const result = await queryDatabase<Duty>(queries.updateDutyName, [name, id])

    return result.length === 0 ? null : result[0]
  } catch (error) {
    throw new Error(`Failed to update duty name: ${(error as Error).message}`)
  }
}

export const updateDutyStatus = async (
  id: string,
  is_completed: boolean
): Promise<Duty | null> => {
  try {
    const result = await queryDatabase<Duty>(queries.updateDutyStatus, [
      is_completed,
      id,
    ])

    return result.length === 0 ? null : result[0]
  } catch (error) {
    throw new Error(`Failed to update duty status: ${(error as Error).message}`)
  }
}

export const deleteDuty = async (id: string): Promise<Duty | null> => {
  try {
    const result = await queryDatabase<Duty>(queries.deleteDuty, [id])

    return result.length === 0 ? null : result[0]
  } catch (error) {
    throw new Error(`Failed to delete duty: ${(error as Error).message}`)
  }
}
