import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Button, Input } from 'antd'

type Inputs = {
  itemName: string
}

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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      itemName: itemName,
    },
  })

  const onCancel = () => {
    onHandleCancel()
  }

  const onSave: SubmitHandler<Inputs> = (data) => {
    const { itemName } = data

    if (itemName.trim() === '') {
      onCancel()
    } else {
      onHandleSave(itemName)
    }
  }

  return (
    <div className="edit-item">
      <Controller
        name="itemName"
        control={control}
        rules={{
          maxLength: 100, // Fixed the max length here
        }}
        render={({ field }) => (
          <Input
            {...field}
            className="edit-input"
            variant="borderless"
            autoFocus
            placeholder="Add a new item"
            onPressEnter={handleSubmit(onSave)}
            onBlur={onCancel}
          />
        )}
      />

      <Button type="primary" onClick={handleSubmit(onSave)}>
        Save
      </Button>

      {errors.itemName && (
        <span className="error-message">Name cannot exceed 100 characters</span>
      )}
    </div>
  )
}
