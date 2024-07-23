import { useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Checkbox, message } from 'antd'

import { Duty } from '../models'
import { deleteDuty, updateDuty } from '../services/duty'

import EditItem from './EditItem'

interface ItemProps {
  item: Duty
  saveCallback: () => void
}

export default function Item({ item, saveCallback }: ItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleSave = async (itemName: string) => {
    try {
      await updateDuty(item.id, itemName, item.isCompleted)
      setIsEditing(false)
      saveCallback()
    } catch (err) {
      message.error('Failed to update duty')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDuty(id)
      saveCallback()
    } catch (err) {
      message.error('Failed to delete duty')
    }
  }

  const handleToggle = async () => {
    try {
      await updateDuty(item.id, item.name, !item.isCompleted)
      saveCallback()
    } catch (err) {
      message.error('Failed to update duty status')
    }
  }

  return (
    <li key={item.id}>
      {isEditing ? (
        <EditItem
          itemName={item.name}
          onHandleSave={handleSave}
          onHandleCancel={() => setIsEditing(false)}
        ></EditItem>
      ) : (
        <div className="item">
          <Checkbox
            checked={item.isCompleted}
            onChange={handleToggle}
            style={{ marginRight: 8 }}
          />

          <span style={{ flexGrow: 1 }} onClick={() => setIsEditing(true)}>
            {item.name}
          </span>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(item.id)
            }}
          />
        </div>
      )}
    </li>
  )
}
