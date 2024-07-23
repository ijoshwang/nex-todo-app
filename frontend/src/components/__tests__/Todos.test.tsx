import { act } from 'react'
import { render, screen, waitFor } from '@testing-library/react'

import { Duty } from '@/models'
import { getDuties } from '@/services/duty'

import Todos from '../Todos'

// Mock the getDuties service
jest.mock('@/services/duty', () => ({
  getDuties: jest.fn(),
}))

const mockDuties: Duty[] = [
  {
    id: '1',
    name: 'Duty 1',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Duty 2',
    isCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

describe('Todos Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders Todos component', async () => {
    ;(getDuties as jest.Mock).mockResolvedValue(mockDuties)
    await act(async () => {
      render(<Todos />)
    })
    expect(screen.getByText('NEX TODO')).toBeInTheDocument()
  })

  test('displays loading spinner while fetching duties', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ;(getDuties as jest.Mock).mockReturnValue(new Promise(() => {}))
    await act(async () => {
      render(<Todos />)
    })
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  test('displays error message if fetching duties fails', async () => {
    ;(getDuties as jest.Mock).mockRejectedValue(
      new Error('Failed to load duties')
    )
    await act(async () => {
      render(<Todos />)
    })
    await waitFor(() => {
      expect(screen.getByText('Failed to load duties')).toBeInTheDocument()
    })
  })

  test('displays duties after fetching', async () => {
    ;(getDuties as jest.Mock).mockResolvedValue(mockDuties)
    await act(async () => {
      render(<Todos />)
    })
    await waitFor(() => {
      expect(screen.getByText('Duty 1')).toBeInTheDocument()
      expect(screen.getByText('Duty 2')).toBeInTheDocument()
    })
  })

  test('renders AddItem component', async () => {
    ;(getDuties as jest.Mock).mockResolvedValue(mockDuties)
    await act(async () => {
      render(<Todos />)
    })
    await waitFor(() => {
      expect(screen.getByText('Add a new item')).toBeInTheDocument()
    })
  })
})
