import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { message } from 'antd'

import { Duty } from '@/models'
import { deleteDuty, updateDuty } from '@/services/duty'

import Item from '../Item'

jest.mock('@/services/duty')
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd')

  return {
    ...originalAntd,
    message: {
      ...originalAntd.message,
      error: jest.fn(),
    },
  }
})

const mockDuty: Duty = {
  id: '1',
  name: 'Test Duty',
  isCompleted: false,
  createdAt: '2024-07-23T15:21:51.894Z',
  updatedAt: '2024-07-23T15:21:51.894Z',
}

const mockSaveCallback = jest.fn()

describe('Item Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders item correctly', () => {
    render(<Item item={mockDuty} saveCallback={mockSaveCallback} />)

    expect(screen.getByText('Test Duty')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  test('toggles edit mode', async () => {
    render(<Item item={mockDuty} saveCallback={mockSaveCallback} />)

    fireEvent.click(screen.getByText('Test Duty'))
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a new item')).toBeInTheDocument()
    })
  })

  test('handles edit mode', async () => {
    render(<Item item={mockDuty} saveCallback={mockSaveCallback} />)

    fireEvent.click(screen.getByText('Test Duty'))
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a new item')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Add a new item'), {
      target: { value: 'Updated Duty' },
    })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(updateDuty).toHaveBeenCalledWith('1', 'Updated Duty', false)
    })
    expect(mockSaveCallback).toHaveBeenCalled()
  })

  test('handles delete', async () => {
    render(<Item item={mockDuty} saveCallback={mockSaveCallback} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(deleteDuty).toHaveBeenCalledWith('1')
    })
    expect(mockSaveCallback).toHaveBeenCalled()
  })

  test('handles toggle', async () => {
    render(<Item item={mockDuty} saveCallback={mockSaveCallback} />)

    fireEvent.click(screen.getByRole('checkbox'))

    await waitFor(() => {
      expect(updateDuty).toHaveBeenCalledWith('1', 'Test Duty', true)
    })
    expect(mockSaveCallback).toHaveBeenCalled()
  })

  test('handles update error', async () => {
    ;(updateDuty as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to update duty')
    )

    render(<Item item={mockDuty} saveCallback={mockSaveCallback} />)

    fireEvent.click(screen.getByText('Test Duty'))
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a new item')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Add a new item'), {
      target: { value: 'Updated Duty' },
    })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to update duty')
    })
  })

  test('handles delete error', async () => {
    ;(deleteDuty as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to delete duty')
    )

    render(<Item item={mockDuty} saveCallback={mockSaveCallback} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to delete duty')
    })
  })

  test('handles toggle error', async () => {
    ;(updateDuty as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to update duty status')
    )

    render(<Item item={mockDuty} saveCallback={mockSaveCallback} />)

    fireEvent.click(screen.getByRole('checkbox'))

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to update duty status')
    })
  })
})
