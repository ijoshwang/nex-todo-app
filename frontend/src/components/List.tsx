import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { List, message, Spin } from 'antd'
import * as yup from 'yup'

import {
  createDuty,
  deleteDuty,
  Duty,
  getDuties,
  updateDuty,
} from '../services/duty'

import AddItem from './AddItem'
import Item from './Item'

const dutySchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
})

type FormData = {
  name: string
}

const Checklist: React.FC = () => {
  const { control, handleSubmit, reset, setValue } = useForm<FormData>({
    resolver: yupResolver(dutySchema),
  })

  const [items, setItems] = useState<Duty[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState<boolean>(false)

  useEffect(() => {
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

    fetchItems()
  }, [])

  const handleAddItem: SubmitHandler<FormData> = async (data) => {
    try {
      const newDuty = await createDuty(data.name)
      setItems([...items, newDuty])
      reset()
      setIsAdding(false)
    } catch (err) {
      message.error('Failed to add duty')
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDuty(id)
      setItems(items.filter((item) => item.id !== id))
    } catch (err) {
      message.error('Failed to delete duty')
    }
  }

  const handleEditItem = (index: number) => {
    setEditingIndex(index)
    setValue('name', items[index].name)
  }

  const handleSaveEdit: SubmitHandler<FormData> = async (data) => {
    if (editingIndex !== null) {
      const item = items[editingIndex]

      try {
        const updatedDuty = await updateDuty(
          item.id,
          data.name,
          item.isCompleted
        )
        const updatedItems = [...items]
        updatedItems[editingIndex] = updatedDuty
        setItems(updatedItems)
        setEditingIndex(null)
        reset()
      } catch (err) {
        message.error('Failed to update duty')
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    reset()
  }

  const handleToggleCompleted = async (index: number) => {
    const item = items[index]

    try {
      const updatedDuty = await updateDuty(
        item.id,
        item.name,
        !item.isCompleted
      )
      const updatedItems = [...items]
      updatedItems[index] = updatedDuty
      setItems(updatedItems)
    } catch (err) {
      message.error('Failed to update duty status')
    }
  }

  if (loading) {
    return <Spin />
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h3>CHECKLIST</h3>
      <List
        dataSource={items}
        renderItem={(item, index) => (
          <Item
            key={item.id}
            item={item}
            index={index}
            editingIndex={editingIndex}
            control={control}
            handleEditItem={handleEditItem}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleDeleteItem={handleDeleteItem}
            handleToggleCompleted={handleToggleCompleted}
          />
        )}
      />
      <AddItem
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        control={control}
        handleAddItem={handleAddItem}
      />
    </div>
  )
}

export default Checklist
