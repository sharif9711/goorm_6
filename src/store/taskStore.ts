import { create } from 'zustand'
import type { Task } from '@/types'
import type { CreateTaskInput, UpdateTaskInput } from '@/api/taskApi'
import * as taskApi from '@/api/taskApi'

interface TaskState {
  tasks: Task[]
  loading: boolean
  fetchTasks: (userId: string) => Promise<void>
  fetchTodayTasks: (userId: string) => Promise<Task[]>
  createTask: (userId: string, input: CreateTaskInput) => Promise<void>
  updateTask: (taskId: string, input: UpdateTaskInput) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  reorderTasks: (orderedIds: string[]) => Promise<void>
  toggleComplete: (task: Task) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async (userId) => {
    set({ loading: true })
    try {
      const tasks = await taskApi.fetchTasks(userId)
      set({ tasks })
    } finally {
      set({ loading: false })
    }
  },

  fetchTodayTasks: async (userId) => {
    set({ loading: true })
    try {
      const tasks = await taskApi.fetchTodayTasks(userId)
      set({ tasks })
      return tasks
    } finally {
      set({ loading: false })
    }
  },

  createTask: async (userId, input) => {
    const task = await taskApi.createTask(userId, input)
    set({ tasks: [task, ...get().tasks] })
  },

  updateTask: async (taskId, input) => {
    const updated = await taskApi.updateTask(taskId, input)
    set({
      tasks: get().tasks.map((t) => (t.id === taskId ? updated : t)),
    })
  },

  deleteTask: async (taskId) => {
    await taskApi.deleteTask(taskId)
    set({ tasks: get().tasks.filter((t) => t.id !== taskId) })
  },

  reorderTasks: async (orderedIds) => {
    await taskApi.reorderTasks(orderedIds)
    const { tasks } = get()
    const map = new Map(tasks.map((t) => [t.id, t]))
    const reordered = orderedIds
      .map((id, i) => {
        const t = map.get(id)
        return t ? { ...t, sort_order: i } : null
      })
      .filter(Boolean) as Task[]
    set({ tasks: reordered })
  },

  toggleComplete: async (task) => {
    const status = task.status === 'completed' ? 'pending' : 'completed'
    await get().updateTask(task.id, { status })
  },
}))
