import { generateId, getDb, updateDb } from '@/lib/localDb'
import type { Task, TaskPriority, TaskStatus, RepeatType } from '@/types'

export interface CreateTaskInput {
  title: string
  description?: string | null
  priority?: TaskPriority
  due_date?: string | null
  repeat_type?: RepeatType
  category_id?: string | null
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: TaskStatus
  sort_order?: number
}

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => a.sort_order - b.sort_order || b.created_at.localeCompare(a.created_at),
  )
}

export async function fetchTasks(userId: string): Promise<Task[]> {
  return sortTasks(getDb().tasks.filter((t) => t.user_id === userId))
}

export async function fetchTodayTasks(userId: string): Promise<Task[]> {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const tasks = getDb().tasks.filter((t) => {
    if (t.user_id !== userId || !t.due_date) return false
    const due = new Date(t.due_date).getTime()
    return due >= start.getTime() && due <= end.getTime()
  })
  return sortTasks(tasks)
}

export async function createTask(userId: string, input: CreateTaskInput): Promise<Task> {
  const task: Task = {
    id: generateId(),
    user_id: userId,
    title: input.title,
    description: input.description ?? null,
    priority: input.priority ?? 'P3',
    status: 'pending',
    due_date: input.due_date ?? null,
    repeat_type: input.repeat_type ?? 'none',
    category_id: input.category_id ?? null,
    sort_order: Date.now(),
    created_at: new Date().toISOString(),
  }
  updateDb((db) => ({ ...db, tasks: [...db.tasks, task] }))
  return task
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  let updated: Task | null = null
  updateDb((db) => {
    const tasks = db.tasks.map((t) => {
      if (t.id !== taskId) return t
      updated = { ...t, ...input }
      return updated
    })
    return { ...db, tasks }
  })
  if (!updated) throw new Error('할 일을 찾을 수 없습니다.')
  return updated
}

export async function deleteTask(taskId: string): Promise<void> {
  updateDb((db) => ({
    ...db,
    tasks: db.tasks.filter((t) => t.id !== taskId),
  }))
}

export async function reorderTasks(orderedIds: string[]): Promise<void> {
  updateDb((db) => ({
    ...db,
    tasks: db.tasks.map((t) => {
      const index = orderedIds.indexOf(t.id)
      return index >= 0 ? { ...t, sort_order: index } : t
    }),
  }))
}
