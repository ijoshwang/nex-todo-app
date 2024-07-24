import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'

import App from '../App'

describe('App Component', () => {
  test('renders the whole app correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(container).toMatchSnapshot()
  })
})
