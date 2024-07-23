import { Duty, DutyDTO } from '../models'

import { apiClient } from './client'

const toCamelCase = (duty: DutyDTO): Duty => ({
  id: duty.id,
  name: duty.name,
  isCompleted: duty.is_completed,
  createdAt: duty.created_at,
  updatedAt: duty.updated_at,
})

export const getDuties = async (): Promise<Duty[]> => {
  try {
    const response = await apiClient.get<DutyDTO[]>('/duties')

    return response.map(toCamelCase)
  } catch (error) {
    throw new Error('Failed to fetch duties')
  }
}

export const getDutyById = async (id: string): Promise<Duty> => {
  try {
    const response = await apiClient.get<DutyDTO>(`/duties/${id}`)

    return toCamelCase(response)
  } catch (error) {
    throw new Error(`Failed to fetch duty with id ${id}`)
  }
}

export const createDuty = async (name: string): Promise<Duty> => {
  try {
    const response = await apiClient.post<DutyDTO>('/duties', { name })

    return toCamelCase(response)
  } catch (error) {
    throw new Error('Failed to create duty')
  }
}

export const updateDuty = async (
  id: string,
  name?: string,
  isCompleted?: boolean
): Promise<Duty> => {
  const payload =
    name !== undefined
      ? {
          name,
        }
      : {
          is_completed: isCompleted,
        }

  try {
    const response = await apiClient.put<DutyDTO>(`/duties/${id}`, payload)

    return toCamelCase(response)
  } catch (error) {
    throw new Error(`Failed to update duty with id ${id}`)
  }
}

export const deleteDuty = async (id: string): Promise<void> => {
  try {
    await apiClient.delete<void>(`/duties/${id}`)
  } catch (error) {
    throw new Error(`Failed to delete duty with id ${id}`)
  }
}
