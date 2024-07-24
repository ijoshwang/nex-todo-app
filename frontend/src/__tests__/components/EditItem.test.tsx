import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'

import EditItem from '../../components/EditItem'

// Mock the props
const mockHandleSave = jest.fn()
const mockHandleCancel = jest.fn()

describe('EditItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with default props', () => {
    render(
      <EditItem
        onHandleSave={mockHandleSave}
        onHandleCancel={mockHandleCancel}
      />
    )

    expect(screen.getByPlaceholderText('Add a new item')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('renders correctly with given itemName', () => {
    render(
      <EditItem
        itemName="Test Item"
        onHandleSave={mockHandleSave}
        onHandleCancel={mockHandleCancel}
      />
    )

    expect(screen.getByDisplayValue('Test Item')).toBeInTheDocument()
  })

  it('calls onHandleSave with the correct value', async () => {
    render(
      <EditItem
        onHandleSave={mockHandleSave}
        onHandleCancel={mockHandleCancel}
      />
    )

    fireEvent.change(screen.getByPlaceholderText('Add a new item'), {
      target: { value: 'New Item' },
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Save'))
    })

    expect(mockHandleSave).toHaveBeenCalledWith('New Item')
  })

  it('calls onHandleCancel when the input is blurred', async () => {
    render(
      <EditItem
        onHandleSave={mockHandleSave}
        onHandleCancel={mockHandleCancel}
      />
    )

    await act(async () => {
      fireEvent.blur(screen.getByPlaceholderText('Add a new item'))
    })

    expect(mockHandleCancel).toHaveBeenCalled()
  })

  it('displays an error message when itemName exceeds 100 characters', async () => {
    render(
      <EditItem
        onHandleSave={mockHandleSave}
        onHandleCancel={mockHandleCancel}
      />
    )

    const longName = 'a'.repeat(101)
    fireEvent.change(screen.getByPlaceholderText('Add a new item'), {
      target: { value: longName },
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Save'))
    })

    expect(
      screen.getByText('Name cannot exceed 100 characters')
    ).toBeInTheDocument()
  })

  it('does not call onHandleSave when itemName is empty', async () => {
    render(
      <EditItem
        onHandleSave={mockHandleSave}
        onHandleCancel={mockHandleCancel}
      />
    )

    fireEvent.change(screen.getByPlaceholderText('Add a new item'), {
      target: { value: ' ' },
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Save'))
    })

    expect(mockHandleSave).not.toHaveBeenCalled()
  })
})
