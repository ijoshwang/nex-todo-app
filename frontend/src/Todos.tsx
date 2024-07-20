import React, { useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Input, List, Space, Typography } from 'antd'

interface Task {
  id: number
  name: string
}

const Component: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Finish project proposal' },
    { id: 2, name: 'Schedule team meeting' },
    { id: 3, name: 'Buy groceries' },
  ])
  const [newTask, setNewTask] = useState<string>('')
  const [editingTask, setEditingTask] = useState<number | null>(null)
  const [editedTask, setEditedTask] = useState<string>('')

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const newId =
        tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
      setTasks([...tasks, { id: newId, name: newTask }])
      setNewTask('')
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id)
    setEditedTask(task.name)
  }

  const handleUpdateTask = () => {
    if (editedTask.trim() !== '') {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask ? { ...task, name: editedTask } : task
        )
      )
      setEditingTask(null)
      setEditedTask('')
    }
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          To-Do List
        </Typography.Title>
        <Space style={{ marginBottom: '16px', width: '100%' }}>
          <Input
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={handleAddTask}>
            Add
          </Button>
        </Space>
        <List
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item
              actions={[
                editingTask === task.id ? (
                  <Button type="link" onClick={handleUpdateTask}>
                    Update
                  </Button>
                ) : (
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEditTask(task)}
                  />
                ),
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteTask(task.id)}
                />,
              ]}
            >
              {editingTask === task.id ? (
                <Input
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                  style={{ flex: 1 }}
                />
              ) : (
                <Typography.Text>{task.name}</Typography.Text>
              )}
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

export default Component
