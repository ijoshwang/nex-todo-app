import React, { useEffect, useState } from 'react'
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input, List } from 'antd'

import {
  createDuty,
  deleteDuty,
  Duty,
  getDuties,
  updateDuty,
} from './services/duty'

interface Item extends Duty {}

const Checklist: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [newItem, setNewItem] = useState<string>('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingText, setEditingText] = useState<string>('')
  const [isAdding, setIsAdding] = useState<boolean>(false)

  useEffect(() => {
    const fetchItems = async () => {
      const duties = await getDuties()
      setItems(duties)
    }

    fetchItems()
  }, [])

  const handleAddItem = async () => {
    if (newItem.trim()) {
      const newDuty = await createDuty(newItem)
      setItems([...items, newDuty])
      setNewItem('')
      setIsAdding(false)
    }
  }

  const handleDeleteItem = async (index: number) => {
    const item = items[index]
    await deleteDuty(item.id)
    setItems(items.filter((_, i) => i !== index))
  }

  const handleEditItem = (index: number) => {
    setEditingIndex(index)
    setEditingText(items[index].name)
  }

  const handleSaveEdit = async (index: number) => {
    if (editingText.trim()) {
      const item = items[index]
      const updatedDuty = await updateDuty(
        item.id,
        editingText,
        item.isCompleted
      )
      const updatedItems = [...items]
      updatedItems[index] = updatedDuty
      setItems(updatedItems)
      setEditingIndex(null)
      setEditingText('')
    } else {
      handleDeleteItem(index)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingText('')
  }

  const handleNewItemBlur = () => {
    setNewItem('')
    setIsAdding(false)
  }

  const handleNewItemClick = () => {
    setIsAdding(true)
  }

  const handleToggleCompleted = async (index: number) => {
    const item = items[index]
    const updatedDuty = await updateDuty(item.id, item.name, !item.isCompleted)
    const updatedItems = [...items]
    updatedItems[index] = updatedDuty
    setItems(updatedItems)
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
              onClick={handleNewItemClick}
              style={{ cursor: 'pointer' }}
            >
              {isAdding ? (
                <Input
                  placeholder="Item"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onPressEnter={handleAddItem}
                  onBlur={handleNewItemBlur}
                  autoFocus
                  style={{
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    width: '100%',
                  }}
                />
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
                  <>
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onPressEnter={() => handleSaveEdit(index)}
                      onBlur={handleCancelEdit}
                      autoFocus
                      style={{
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                        flexGrow: 1,
                      }}
                    />
                    <Button
                      type="text"
                      icon={<SaveOutlined />}
                      onClick={() => handleSaveEdit(index)}
                      style={{ marginLeft: 'auto' }}
                    />
                  </>
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
