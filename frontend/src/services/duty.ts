import { apiClient } from './client'

export interface Duty {
  id: string
  name: string
  created_at: string
  updated_at: string
  isCompleted: boolean
}

export const getDuties = async (): Promise<Duty[]> => {
  return apiClient.get<Duty[]>('/duties')
}

export const getDutyById = async (id: string): Promise<Duty> => {
  return apiClient.get<Duty>(`/duties/${id}`)
}

export const createDuty = async (name: string): Promise<Duty> => {
  return apiClient.post<Duty>('/duties', { name, isCompleted: false })
}

export const updateDuty = async (
  id: string,
  name: string,
  isCompleted: boolean
): Promise<Duty> => {
  return apiClient.put<Duty>(`/duties/${id}`, { name, isCompleted })
}

export const deleteDuty = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/duties/${id}`)
}
