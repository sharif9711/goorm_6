import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, List, Spin, message } from 'antd'
import { PageHeader } from '@/components/common/PageHeader'
import { TaskListItem } from '@/components/task/TaskListItem'
import {
  TaskFormModal,
  taskToFormValues,
  type TaskFormValues,
} from '@/components/task/TaskFormModal'
import { useAuthUserId } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import type { Task, TaskPriority } from '@/types'

export default function TodayPage() {
  const userId = useAuthUserId()
  const {
    tasks,
    loading,
    fetchTodayTasks,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
  } = useTaskStore()
  const [editTask, setEditTask] = useState<Task | null>(null)
  const dragTaskId = useRef<string | null>(null)

  useEffect(() => {
    if (userId) void fetchTodayTasks(userId)
  }, [userId, fetchTodayTasks])

  const handleDragStart = (_e: React.DragEvent, taskId: string) => {
    dragTaskId.current = taskId
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = useCallback(
    (_e: React.DragEvent, targetId: string) => {
      const sourceId = dragTaskId.current
      if (!sourceId || sourceId === targetId) return

      const ids = tasks.map((t) => t.id)
      const from = ids.indexOf(sourceId)
      const to = ids.indexOf(targetId)
      if (from < 0 || to < 0) return

      const next = [...ids]
      next.splice(from, 1)
      next.splice(to, 0, sourceId)

      void reorderTasks(next).catch(() => message.error('순서 변경에 실패했습니다'))
      dragTaskId.current = null
    },
    [tasks, reorderTasks],
  )

  const handleEditSubmit = async (values: TaskFormValues) => {
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

  const handlePriorityChange = async (task: Task, priority: TaskPriority) => {
    try {
      await updateTask(task.id, { priority })
    } catch {
      message.error('우선순위 변경에 실패했습니다')
    }
  }

  return (
    <div>
      <PageHeader
        title="오늘"
        subtitle="오늘 마감 할 일을 확인하고 완료하세요"
      />

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin />
          </div>
        ) : (
          <List
            dataSource={tasks}
            locale={{ emptyText: '오늘 마감인 할 일이 없습니다' }}
            renderItem={(task) => (
              <TaskListItem
                key={task.id}
                task={task}
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onToggle={(t) => void toggleComplete(t)}
                onEdit={setEditTask}
                onDelete={(t) => void handleDelete(t)}
                onPriorityChange={(t, p) => void handlePriorityChange(t, p)}
              />
            )}
          />
        )}
      </Card>

      <TaskFormModal
        open={!!editTask}
        title="할 일 수정"
        initialValues={editTask ? taskToFormValues(editTask) : undefined}
        onCancel={() => setEditTask(null)}
        onSubmit={handleEditSubmit}
      />
    </div>
  )
}
