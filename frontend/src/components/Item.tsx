import React from 'react'
import { Controller } from 'react-hook-form'
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input, List } from 'antd'

import { Duty } from '../services/duty'

interface ItemProps {
  item: Duty
  index: number
  editingIndex: number | null
  control: any
  handleEditItem: (index: number) => void
  handleSaveEdit: any
  handleCancelEdit: () => void
  handleDeleteItem: (id: string) => void
  handleToggleCompleted: (index: number) => void
}

const Item: React.FC<ItemProps> = ({
  item,
  index,
  editingIndex,
  control,
  handleEditItem,
  handleSaveEdit,
  handleCancelEdit,
  handleDeleteItem,
  handleToggleCompleted,
}) => {
  return (
    <List.Item
      key={item.id}
      onClick={() => handleEditItem(index)}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={item.isCompleted}
          onChange={() => handleToggleCompleted(index)}
          style={{ marginRight: 8 }}
        />
        {editingIndex === index ? (
          <form onSubmit={handleSaveEdit}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    autoFocus
                    style={{
                      border: fieldState.error ? '1px solid red' : 'none',
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
            handleDeleteItem(item.id)
          }}
          style={{ marginLeft: 'auto' }}
        />
      </div>
    </List.Item>
  )
}

export default Item
