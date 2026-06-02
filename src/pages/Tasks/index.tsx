import { useEffect, useState } from 'react'
import { Button, Card, List, Spin, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components/common/PageHeader'
import { TaskListItem } from '@/components/task/TaskListItem'
import {
  TaskFormModal,
  taskToFormValues,
  type TaskFormValues,
} from '@/components/task/TaskFormModal'
import { useAuthUserId } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/types'

export default function TasksPage() {
  const userId = useAuthUserId()
  const {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  } = useTaskStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  useEffect(() => {
    if (userId) void fetchTasks(userId)
  }, [userId, fetchTasks])

  const handleCreate = async (values: TaskFormValues) => {
    if (!userId) return
    try {
      await createTask(userId, {
        title: values.title,
        description: values.description ?? null,
        priority: values.priority,
        due_date: values.due_date?.toISOString() ?? null,
      })
      message.success('할 일이 생성되었습니다')
      setModalOpen(false)
    } catch {
      message.error('생성에 실패했습니다')
    }
  }

  const handleEdit = async (values: TaskFormValues) => {
    if (!editTask) return
    try {
      await updateTask(editTask.id, {
        title: values.title,
        description: values.description ?? null,
        priority: values.priority,
        due_date: values.due_date?.toISOString() ?? null,
      })
      message.success('할 일이 수정되었습니다')
      setEditTask(null)
    } catch {
      message.error('수정에 실패했습니다')
    }
  }

  const handleDelete = async (task: Task) => {
    try {
      await deleteTask(task.id)
      message.success('할 일이 삭제되었습니다')
    } catch {
      message.error('삭제에 실패했습니다')
    }
  }

  return (
    <div>
      <PageHeader
        title="할일"
        subtitle="모든 할 일을 관리하세요"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            새 할 일
          </Button>
        }
      />

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin />
          </div>
        ) : (
          <List
            dataSource={tasks}
            locale={{ emptyText: '등록된 할 일이 없습니다' }}
            renderItem={(task) => (
              <TaskListItem
                key={task.id}
                task={task}
                onToggle={(t) => void toggleComplete(t)}
                onEdit={setEditTask}
                onDelete={(t) => void handleDelete(t)}
              />
            )}
          />
        )}
      </Card>

      <TaskFormModal
        open={modalOpen}
        title="새 할 일"
        onCancel={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <TaskFormModal
        open={!!editTask}
        title="할 일 수정"
        initialValues={editTask ? taskToFormValues(editTask) : undefined}
        onCancel={() => setEditTask(null)}
        onSubmit={handleEdit}
      />
    </div>
  )
}
