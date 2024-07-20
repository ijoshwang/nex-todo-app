import { apiClient } from './client'

export interface Duty {
  id: string
  name: string
  isCompleted: boolean
  created_at: string
  updated_at: string
}

export const getDuties = async (): Promise<Duty[]> => {
  try {
    return await apiClient.get<Duty[]>('/duties')
  } catch (error) {
    // Handle the error or rethrow it to be handled by the caller
    throw new Error('Failed to fetch duties')
  }
}

export const getDutyById = async (id: string): Promise<Duty> => {
  try {
    return await apiClient.get<Duty>(`/duties/${id}`)
  } catch (error) {
    throw new Error(`Failed to fetch duty with id ${id}`)
  }
}

export const createDuty = async (name: string): Promise<Duty> => {
  try {
    return await apiClient.post<Duty>('/duties', { name, isCompleted: false })
  } catch (error) {
    throw new Error('Failed to create duty')
  }
}

export const updateDuty = async (
  id: string,
  name: string,
  isCompleted: boolean
): Promise<Duty> => {
  try {
    return await apiClient.put<Duty>(`/duties/${id}`, { name, isCompleted })
  } catch (error) {
    throw new Error(`Failed to update duty with id ${id}`)
  }
}

export const deleteDuty = async (id: string): Promise<void> => {
  try {
    return await apiClient.delete<void>(`/duties/${id}`)
  } catch (error) {
    throw new Error(`Failed to delete duty with id ${id}`)
  }
}
