import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Input, List } from 'antd'

interface AddItemProps {
  isAdding: boolean
  setIsAdding: (isAdding: boolean) => void
  control: any
  handleAddItem: SubmitHandler<any>
}

const AddItem: React.FC<AddItemProps> = ({
  isAdding,
  setIsAdding,
  control,
  handleAddItem,
}) => {
  return (
    <List.Item onClick={() => setIsAdding(true)} style={{ cursor: 'pointer' }}>
      {isAdding ? (
        <form onSubmit={handleAddItem}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <div
                style={{ display: 'flex', alignItems: 'center', width: '100%' }}
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
                  onBlur={() => setIsAdding(false)}
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
  )
}

export default AddItem
