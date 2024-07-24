import { act } from 'react'
import { render, screen, waitFor } from '@testing-library/react'

import Todos from '@/components/Todos'
import { Duty } from '@/models'
import { getDuties } from '@/services/duty'

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
    let container: HTMLElement | null = null
    await act(async () => {
      const { container: renderedContainer } = render(<Todos />)
      container = renderedContainer
    })
    expect(screen.getByText('NEX TODO')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('displays loading spinner while fetching duties', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ;(getDuties as jest.Mock).mockReturnValue(new Promise(() => {}))
    let container: HTMLElement | null = null
    await act(async () => {
      const { container: renderedContainer } = render(<Todos />)
      container = renderedContainer
    })
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('displays error message if fetching duties fails', async () => {
    ;(getDuties as jest.Mock).mockRejectedValue(
      new Error('Failed to load duties')
    )
    let container: HTMLElement | null = null
    await act(async () => {
      const { container: renderedContainer } = render(<Todos />)
      container = renderedContainer
    })
    await waitFor(() => {
      expect(screen.getByText('Failed to load duties')).toBeInTheDocument()
    })
    expect(container).toMatchSnapshot()
  })

  test('displays duties after fetching', async () => {
    ;(getDuties as jest.Mock).mockResolvedValue(mockDuties)
    let container: HTMLElement | null = null
    await act(async () => {
      const { container: renderedContainer } = render(<Todos />)
      container = renderedContainer
    })
    await waitFor(() => {
      expect(screen.getByText('Duty 1')).toBeInTheDocument()
      expect(screen.getByText('Duty 2')).toBeInTheDocument()
    })
    expect(container).toMatchSnapshot()
  })

  test('renders AddItem component', async () => {
    ;(getDuties as jest.Mock).mockResolvedValue(mockDuties)
    let container: HTMLElement | null = null
    await act(async () => {
      const { container: renderedContainer } = render(<Todos />)
      container = renderedContainer
    })
    await waitFor(() => {
      expect(screen.getByText('Add a new item')).toBeInTheDocument()
    })
    expect(container).toMatchSnapshot()
  })
})
