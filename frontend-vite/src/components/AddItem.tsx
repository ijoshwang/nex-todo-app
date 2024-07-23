import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { message } from 'antd'

import { createDuty } from '../services/duty'

import EditItem from './EditItem'
interface AddItemProps {
  saveCallback: () => void
}

export default function AddItem({ saveCallback }: AddItemProps) {
  const [isAdding, setIsAdding] = useState<boolean>(false)

  const handleSave = async (itemName: string) => {
    try {
      await createDuty(itemName)
      setIsAdding(false)
      saveCallback()
    } catch (err) {
      message.error('Failed to add duty')
    }
  }

  return (
    <div className="add-item" onClick={() => setIsAdding(true)}>
      {isAdding ? (
        <EditItem
          onHandleSave={handleSave}
          onHandleCancel={() => setIsAdding(false)}
        ></EditItem>
      ) : (
        <>
          <PlusOutlined style={{ marginRight: 6 }} />
          <span>Add a new item</span>
        </>
      )}
    </div>
  )
}
