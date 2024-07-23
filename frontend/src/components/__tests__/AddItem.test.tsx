import { act } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { message } from 'antd'

import { createDuty } from '@/services/duty'

import '@testing-library/jest-dom'

import AddItem from '../AddItem'

// Mock the createDuty function
jest.mock('@/services/duty', () => ({
  createDuty: jest.fn(),
}))

// Mock the message error function
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    error: jest.fn(),
  },
}))

describe('AddItem Component', () => {
  const mockSaveCallback = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<AddItem saveCallback={mockSaveCallback} />)
    expect(screen.getByText('Add a new item')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /plus/i })).toBeInTheDocument()
  })

  it('enters add mode when clicked', () => {
    render(<AddItem saveCallback={mockSaveCallback} />)
    fireEvent.click(screen.getByText('Add a new item'))
    expect(screen.getByPlaceholderText('Add a new item')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('calls createDuty and saveCallback when saving a new item', async () => {
    ;(createDuty as jest.Mock).mockResolvedValueOnce({})
    render(<AddItem saveCallback={mockSaveCallback} />)
    fireEvent.click(screen.getByText('Add a new item'))
    fireEvent.change(screen.getByPlaceholderText('Add a new item'), {
      target: { value: 'New Item' },
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Save'))
    })

    await waitFor(() => {
      expect(createDuty).toHaveBeenCalledWith('New Item')
      expect(mockSaveCallback).toHaveBeenCalled()
    })
  })

  it('displays error message if saving fails', async () => {
    ;(createDuty as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to add duty')
    )
    render(<AddItem saveCallback={mockSaveCallback} />)
    fireEvent.click(screen.getByText('Add a new item'))
    fireEvent.change(screen.getByPlaceholderText('Add a new item'), {
      target: { value: 'New Item' },
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Save'))
    })

    await waitFor(() => {
      expect(createDuty).toHaveBeenCalledWith('New Item')
      expect(message.error).toHaveBeenCalledWith('Failed to add duty')
      expect(mockSaveCallback).not.toHaveBeenCalled()
    })
  })

  it('exits add mode without saving when cancel is clicked', () => {
    render(<AddItem saveCallback={mockSaveCallback} />)
    fireEvent.click(screen.getByText('Add a new item'))
    fireEvent.blur(screen.getByPlaceholderText('Add a new item'))
    expect(
      screen.queryByPlaceholderText('Add a new item')
    ).not.toBeInTheDocument()
    expect(screen.getByText('Add a new item')).toBeInTheDocument()
  })
})
