import { queryDatabase } from '../database/db'
import { queries } from '../database/queries'
import { Duty } from '../models/duty.model'
import {
  createDuty,
  deleteDuty,
  getDuties,
  getDutyById,
  updateDutyName,
  updateDutyStatus,
} from '../repositories/duty.repository'

// Mock the database connection
jest.mock('../database/db', () => {
  const originalModule = jest.requireActual('../database/db')

  return {
    ...originalModule,
    queryDatabase: jest.fn(),
  }
})

describe('Duty Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // getDuties tests
  it('should get all duties', async () => {
    const mockDuties: Duty[] = [
      {
        id: '1',
        name: 'Duty 1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
      },
    ]
    jest.mocked(queryDatabase).mockResolvedValue(mockDuties)

    const duties = await getDuties()

    expect(queryDatabase).toHaveBeenCalledWith(queries.selectAllDuties, [])
    expect(duties).toEqual(mockDuties)
  })

  it('should return empty array when there are no duties', async () => {
    jest.mocked(queryDatabase).mockResolvedValue([])

    const duties = await getDuties()

    expect(queryDatabase).toHaveBeenCalledWith(queries.selectAllDuties, [])
    expect(duties).toEqual([])
  })

  it('should handle errors when getting all duties', async () => {
    const error = new Error('Database error')
    jest.mocked(queryDatabase).mockRejectedValue(error)

    await expect(getDuties()).rejects.toThrow(
      'Failed to get duties: Database error'
    )
  })

  // getDutyById tests
  it('should get duty by ID', async () => {
    const mockDuty: Duty = {
      id: '1',
      name: 'Duty 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_completed: false,
    }
    jest.mocked(queryDatabase).mockResolvedValue([mockDuty])

    const duty = await getDutyById('1')

    expect(queryDatabase).toHaveBeenCalledWith(queries.selectDutyById, ['1'])
    expect(duty).toEqual(mockDuty)
  })

  it('should return null when duty by ID is not found', async () => {
    jest.mocked(queryDatabase).mockResolvedValue([])

    const duty = await getDutyById('1')

    expect(queryDatabase).toHaveBeenCalledWith(queries.selectDutyById, ['1'])
    expect(duty).toBeNull()
  })

  it('should handle errors when getting duty by ID', async () => {
    const error = new Error('Database error')
    jest.mocked(queryDatabase).mockRejectedValue(error)

    await expect(getDutyById('1')).rejects.toThrow(
      'Failed to get duty by ID: Database error'
    )
  })

  // createDuty tests
  it('should create a duty', async () => {
    const mockDuty: Duty = {
      id: '1',
      name: 'Duty 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_completed: false,
    }
    jest.mocked(queryDatabase).mockResolvedValue([mockDuty])

    const duty = await createDuty('Duty 1')

    expect(queryDatabase).toHaveBeenCalledWith(queries.insertDuty, ['Duty 1'])
    expect(duty).toEqual(mockDuty)
  })

  it('should handle errors when creating a duty', async () => {
    const error = new Error('Database error')
    jest.mocked(queryDatabase).mockRejectedValue(error)

    await expect(createDuty('New Duty')).rejects.toThrow(
      'Failed to create duty: Database error'
    )
  })

  // updateDutyName tests
  it('should update a duty name', async () => {
    const mockDuty: Duty = {
      id: '1',
      name: 'Updated Duty',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_completed: false,
    }
    jest.mocked(queryDatabase).mockResolvedValue([mockDuty])

    const duty = await updateDutyName('1', 'Updated Duty')

    expect(queryDatabase).toHaveBeenCalledWith(queries.updateDutyName, [
      'Updated Duty',
      '1',
    ])
    expect(duty).toEqual(mockDuty)
  })

  it('should handle null values when updating a duty name', async () => {
    jest.mocked(queryDatabase).mockResolvedValue([])

    const duty = await updateDutyName('1', 'Updated Duty')

    expect(queryDatabase).toHaveBeenCalledWith(queries.updateDutyName, [
      'Updated Duty',
      '1',
    ])
    expect(duty).toBeNull()
  })

  it('should handle errors when updating duty name', async () => {
    const error = new Error('Database error')
    jest.mocked(queryDatabase).mockRejectedValue(error)

    await expect(updateDutyName('1', 'Updated Duty')).rejects.toThrow(
      'Failed to update duty name: Database error'
    )
  })

  // updateDutyStatus tests
  it('should update a duty status', async () => {
    const mockDuty: Duty = {
      id: '1',
      name: 'Duty 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_completed: true,
    }
    jest.mocked(queryDatabase).mockResolvedValue([mockDuty])

    const duty = await updateDutyStatus('1', true)

    expect(queryDatabase).toHaveBeenCalledWith(queries.updateDutyStatus, [
      true,
      '1',
    ])
    expect(duty).toEqual(mockDuty)
  })

  it('should handle null values when updating a duty status', async () => {
    jest.mocked(queryDatabase).mockResolvedValue([])

    const duty = await updateDutyStatus('1', true)

    expect(queryDatabase).toHaveBeenCalledWith(queries.updateDutyStatus, [
      true,
      '1',
    ])
    expect(duty).toBeNull()
  })

  it('should handle errors when updating duty status', async () => {
    const error = new Error('Database error')
    jest.mocked(queryDatabase).mockRejectedValue(error)

    await expect(updateDutyStatus('1', true)).rejects.toThrow(
      'Failed to update duty status: Database error'
    )
  })

  // deleteDuty tests
  it('should delete a duty', async () => {
    const mockDuty: Duty = {
      id: '1',
      name: 'Duty 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_completed: false,
    }
    jest.mocked(queryDatabase).mockResolvedValue([mockDuty])

    const duty = await deleteDuty('1')

    expect(queryDatabase).toHaveBeenCalledWith(queries.deleteDuty, ['1'])
    expect(duty).toEqual(mockDuty)
  })

  it('should handle null values when deleting a duty', async () => {
    jest.mocked(queryDatabase).mockResolvedValue([])

    const duty = await deleteDuty('1')

    expect(queryDatabase).toHaveBeenCalledWith(queries.deleteDuty, ['1'])
    expect(duty).toBeNull()
  })

  it('should handle errors when deleting a duty', async () => {
    const error = new Error('Database error')
    jest.mocked(queryDatabase).mockRejectedValue(error)

    await expect(deleteDuty('1')).rejects.toThrow(
      'Failed to delete duty: Database error'
    )
  })
})
