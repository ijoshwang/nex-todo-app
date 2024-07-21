import { useEffect, useState } from 'react'
import { Spin } from 'antd'

import { Duty, getDuties } from '../services/duty'

import AddItem from './AddItem'
import Item from './Item'

import './Todos.css'

export default function Todos() {
  const [items, setItems] = useState<Duty[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      const duties = await getDuties()
      setItems(duties)
      setLoading(false)
    } catch (err) {
      setError('Failed to load duties')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  if (loading) {
    return <Spin />
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div id="todos">
      <h3>NEX TODO</h3>
      <ul className="list">
        {items.map((item) => (
          <Item key={item.id} item={item} saveCallback={fetchItems} />
        ))}
      </ul>
      <AddItem saveCallback={fetchItems} />
    </div>
  )
}
