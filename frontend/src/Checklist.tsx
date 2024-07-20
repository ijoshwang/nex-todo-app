import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Checkbox, Input, List, message, Spin } from 'antd'
import * as yup from 'yup'

import {
  createDuty,
  deleteDuty,
  Duty,
  getDuties,
  updateDuty,
} from './services/duty'

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

  const handleDeleteItem = async (index: number) => {
    const item = items[index]

    try {
      await deleteDuty(item.id)
      setItems(items.filter((_, i) => i !== index))
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
        dataSource={[
          ...items,
          {
            id: '',
            name: '',
            isCompleted: false,
            created_at: '',
            updated_at: '',
          },
        ]}
        renderItem={(item, index) =>
          index === items.length ? (
            <List.Item
              onClick={() => setIsAdding(true)}
              style={{ cursor: 'pointer' }}
            >
              {isAdding ? (
                <form onSubmit={handleSubmit(handleAddItem)}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Input
                          {...field}
                          placeholder="Item"
                          autoFocus
                          style={{
                            border: fieldState.error ? '1px solid red' : 'none',
                            outline: 'none',
                            boxShadow: 'none',
                            width: '100%',
                          }}
                          onBlur={handleCancelEdit}
                        />
                        <Button
                          htmlType="submit"
                          type="primary"
                          icon={<PlusOutlined />}
                        />
                        {fieldState.error && (
                          <span style={{ color: 'red', marginLeft: 10 }}>
                            {fieldState.error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </form>
              ) : (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <PlusOutlined style={{ marginRight: 8 }} />
                  <span>Add a new item</span>
                </div>
              )}
            </List.Item>
          ) : (
            <List.Item
              key={item.id}
              onClick={() => handleEditItem(index)}
              style={{ cursor: 'pointer' }}
            >
              <div
                style={{ width: '100%', display: 'flex', alignItems: 'center' }}
              >
                <Checkbox
                  checked={item.isCompleted}
                  onChange={() => handleToggleCompleted(index)}
                  style={{ marginRight: 8 }}
                />
                {editingIndex === index ? (
                  <form onSubmit={handleSubmit(handleSaveEdit)}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            {...field}
                            autoFocus
                            style={{
                              border: fieldState.error
                                ? '1px solid red'
                                : 'none',
                              outline: 'none',
                              boxShadow: 'none',
                              flexGrow: 1,
                            }}
                            onBlur={handleCancelEdit}
                          />
                          <Button
                            type="text"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            style={{ marginLeft: 'auto' }}
                          />
                          {fieldState.error && (
                            <span style={{ color: 'red', marginLeft: 10 }}>
                              {fieldState.error.message}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </form>
                ) : (
                  <span style={{ flexGrow: 1 }}>{item.name}</span>
                )}
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteItem(index)
                  }}
                  style={{ marginLeft: 'auto' }}
                />
              </div>
            </List.Item>
          )
        }
      />
    </div>
  )
}

export default Checklist
