import { useState } from 'react'
import { Button, Input } from 'antd'
interface AddItemProps {
  itemName?: string
  onHandleSave: (itemName: string) => void
  onHandleCancel: () => void
}

export default function EditItem({
  itemName = '',
  onHandleSave,
  onHandleCancel,
}: AddItemProps) {
  const [value, setValue] = useState(itemName)

  const onSave = () => {
    onHandleSave(value)
  }

  const onCancel = () => {
    onHandleCancel()
  }

  return (
    <div className="edit-item">
      <Input
        className="edit-input"
        variant="borderless"
        autoFocus
        value={value}
        placeholder="Add a new item"
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={onSave}
        onBlur={onCancel}
      />
      <Button type="primary" onClick={onSave}>
        Save
      </Button>
    </div>
  )
}
