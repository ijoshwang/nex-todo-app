import { Duty, DutyDTO } from '@/models'

import { apiClient } from '../client'
import {
  createDuty,
  deleteDuty,
  getDuties,
  getDutyById,
  updateDuty,
} from '../duty'

jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

describe('Duty Service', () => {
  const fixedDateString = new Date().toISOString()

  const mockDutyDTO: DutyDTO = {
    id: '1',
    name: 'Test Duty',
    is_completed: false,
    created_at: fixedDateString,
    updated_at: fixedDateString,
  }

  const mockDuty: Duty = {
    id: '1',
    name: 'Test Duty',
    isCompleted: false,
    createdAt: fixedDateString,
    updatedAt: fixedDateString,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getDuties', () => {
    it('should fetch and transform duties successfully', async () => {
      jest.mocked(apiClient.get).mockResolvedValue([mockDutyDTO])

      const duties = await getDuties()

      expect(apiClient.get).toHaveBeenCalledWith('/duties')
      expect(duties).toEqual([mockDuty])
    })

    it('should throw an error if fetching duties fails', async () => {
      jest.mocked(apiClient.get).mockRejectedValue(new Error('API Error'))

      await expect(getDuties()).rejects.toThrow('Failed to fetch duties')
    })
  })

  describe('getDutyById', () => {
    it('should fetch and transform a duty by ID successfully', async () => {
      jest.mocked(apiClient.get).mockResolvedValue(mockDutyDTO)

      const duty = await getDutyById('1')

      expect(apiClient.get).toHaveBeenCalledWith('/duties/1')
      expect(duty).toEqual(mockDuty)
    })

    it('should throw an error if fetching the duty by ID fails', async () => {
      jest.mocked(apiClient.get).mockRejectedValue(new Error('API Error'))

      await expect(getDutyById('1')).rejects.toThrow(
        'Failed to fetch duty with id 1'
      )
    })
  })

  describe('createDuty', () => {
    it('should create and transform a duty successfully', async () => {
      jest.mocked(apiClient.post).mockResolvedValue(mockDutyDTO)

      const duty = await createDuty('Test Duty')

      expect(apiClient.post).toHaveBeenCalledWith('/duties', {
        name: 'Test Duty',
      })
      expect(duty).toEqual(mockDuty)
    })

    it('should throw an error if creating the duty fails', async () => {
      jest.mocked(apiClient.post).mockRejectedValue(new Error('API Error'))

      await expect(createDuty('Test Duty')).rejects.toThrow(
        'Failed to create duty'
      )
    })
  })

  describe('updateDuty', () => {
    it('should update and transform a duty name successfully', async () => {
      jest.mocked(apiClient.put).mockResolvedValue(mockDutyDTO)

      const duty = await updateDuty('1', 'Updated Duty')

      expect(apiClient.put).toHaveBeenCalledWith('/duties/1', {
        name: 'Updated Duty',
      })
      expect(duty).toEqual(mockDuty)
    })

    it('should update and transform a duty status successfully', async () => {
      jest.mocked(apiClient.put).mockResolvedValue(mockDutyDTO)

      const duty = await updateDuty('1', undefined, true)

      expect(apiClient.put).toHaveBeenCalledWith('/duties/1', {
        is_completed: true,
      })
      expect(duty).toEqual(mockDuty)
    })

    it('should throw an error if updating the duty fails', async () => {
      jest.mocked(apiClient.put).mockRejectedValue(new Error('API Error'))

      await expect(updateDuty('1', 'Updated Duty')).rejects.toThrow(
        'Failed to update duty with id 1'
      )
    })
  })

  describe('deleteDuty', () => {
    it('should delete a duty successfully', async () => {
      jest.mocked(apiClient.delete).mockResolvedValue(undefined)

      await deleteDuty('1')

      expect(apiClient.delete).toHaveBeenCalledWith('/duties/1')
    })

    it('should throw an error if deleting the duty fails', async () => {
      jest.mocked(apiClient.delete).mockRejectedValue(new Error('API Error'))

      await expect(deleteDuty('1')).rejects.toThrow(
        'Failed to delete duty with id 1'
      )
    })
  })
})
