import { DutyDTO } from '../../models'
import { apiClient } from '../client'
import {
  createDuty,
  deleteDuty,
  getDuties,
  getDutyById,
  updateDuty,
} from '../duty'

jest.mock('../client')

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('Duty Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getDuties', () => {
    it('should fetch and return duties', async () => {
      const mockDuties: DutyDTO[] = [
        {
          id: '1',
          name: 'Test Duty',
          is_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      mockApiClient.get.mockResolvedValue(mockDuties)

      const result = await getDuties()

      expect(mockApiClient.get).toHaveBeenCalledWith('/duties')
      expect(result).toEqual([
        {
          id: '1',
          name: 'Test Duty',
          isCompleted: false,
          createdAt: mockDuties[0].created_at,
          updatedAt: mockDuties[0].updated_at,
        },
      ])
    })

    it('should throw an error if fetching duties fails', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Failed to fetch duties'))

      await expect(getDuties()).rejects.toThrow('Failed to fetch duties')
    })
  })

  describe('getDutyById', () => {
    it('should fetch and return a duty by ID', async () => {
      const mockDuty: DutyDTO = {
        id: '1',
        name: 'Test Duty',
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockApiClient.get.mockResolvedValue(mockDuty)

      const result = await getDutyById('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/duties/1')
      expect(result).toEqual({
        id: '1',
        name: 'Test Duty',
        isCompleted: false,
        createdAt: mockDuty.created_at,
        updatedAt: mockDuty.updated_at,
      })
    })

    it('should throw an error if fetching duty by ID fails', async () => {
      mockApiClient.get.mockRejectedValue(
        new Error('Failed to fetch duty with id 1')
      )

      await expect(getDutyById('1')).rejects.toThrow(
        'Failed to fetch duty with id 1'
      )
    })
  })

  describe('createDuty', () => {
    it('should create and return a new duty', async () => {
      const mockDuty: DutyDTO = {
        id: '1',
        name: 'Test Duty',
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockApiClient.post.mockResolvedValue(mockDuty)

      const result = await createDuty('Test Duty')

      expect(mockApiClient.post).toHaveBeenCalledWith('/duties', {
        name: 'Test Duty',
      })
      expect(result).toEqual({
        id: '1',
        name: 'Test Duty',
        isCompleted: false,
        createdAt: mockDuty.created_at,
        updatedAt: mockDuty.updated_at,
      })
    })

    it('should throw an error if creating duty fails', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Failed to create duty'))

      await expect(createDuty('Test Duty')).rejects.toThrow(
        'Failed to create duty'
      )
    })
  })

  describe('updateDuty', () => {
    it('should update and return a duty with new name', async () => {
      const mockDuty: DutyDTO = {
        id: '1',
        name: 'Updated Duty',
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockApiClient.put.mockResolvedValue(mockDuty)

      const result = await updateDuty('1', 'Updated Duty')

      expect(mockApiClient.put).toHaveBeenCalledWith('/duties/1', {
        name: 'Updated Duty',
      })
      expect(result).toEqual({
        id: '1',
        name: 'Updated Duty',
        isCompleted: false,
        createdAt: mockDuty.created_at,
        updatedAt: mockDuty.updated_at,
      })
    })

    it('should update and return a duty with new status', async () => {
      const mockDuty: DutyDTO = {
        id: '1',
        name: 'Test Duty',
        is_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockApiClient.put.mockResolvedValue(mockDuty)

      const result = await updateDuty('1', undefined, true)

      expect(mockApiClient.put).toHaveBeenCalledWith('/duties/1', {
        is_completed: true,
      })
      expect(result).toEqual({
        id: '1',
        name: 'Test Duty',
        isCompleted: true,
        createdAt: mockDuty.created_at,
        updatedAt: mockDuty.updated_at,
      })
    })

    it('should throw an error if updating duty fails', async () => {
      mockApiClient.put.mockRejectedValue(
        new Error('Failed to update duty with id 1')
      )

      await expect(updateDuty('1', 'Updated Duty')).rejects.toThrow(
        'Failed to update duty with id 1'
      )
    })
  })

  describe('deleteDuty', () => {
    it('should delete a duty successfully', async () => {
      mockApiClient.delete.mockResolvedValue({})

      await deleteDuty('1')

      expect(mockApiClient.delete).toHaveBeenCalledWith('/duties/1')
    })

    it('should throw an error if deleting duty fails', async () => {
      mockApiClient.delete.mockRejectedValue(
        new Error('Failed to delete duty with id 1')
      )

      await expect(deleteDuty('1')).rejects.toThrow(
        'Failed to delete duty with id 1'
      )
    })
  })
})
