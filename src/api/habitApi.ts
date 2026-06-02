import { generateId, getDb, updateDb } from '@/lib/localDb'
import type { Habit, HabitLog } from '@/types'

export interface CreateHabitInput {
  title: string
  target_days?: number
}

export async function fetchHabits(userId: string): Promise<Habit[]> {
  return getDb()
    .habits.filter((h) => h.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function fetchHabitLogs(habitId: string): Promise<HabitLog[]> {
  return getDb()
    .habit_logs.filter((l) => l.habit_id === habitId)
    .sort((a, b) => b.completed_date.localeCompare(a.completed_date))
}

export async function fetchTodayHabitLogs(habitIds: string[]): Promise<HabitLog[]> {
  if (habitIds.length === 0) return []
  const today = new Date().toISOString().slice(0, 10)
  return getDb().habit_logs.filter(
    (log) => habitIds.includes(log.habit_id) && log.completed_date === today,
  )
}

export async function createHabit(userId: string, input: CreateHabitInput): Promise<Habit> {
  const habit: Habit = {
    id: generateId(),
    user_id: userId,
    title: input.title,
    target_days: input.target_days ?? 7,
    created_at: new Date().toISOString(),
  }
  updateDb((db) => ({ ...db, habits: [...db.habits, habit] }))
  return habit
}

export async function deleteHabit(habitId: string): Promise<void> {
  updateDb((db) => ({
    ...db,
    habits: db.habits.filter((h) => h.id !== habitId),
    habit_logs: db.habit_logs.filter((l) => l.habit_id !== habitId),
  }))
}

export async function toggleHabitLog(habitId: string, date: string): Promise<boolean> {
  const db = getDb()
  const existing = db.habit_logs.find(
    (l) => l.habit_id === habitId && l.completed_date === date,
  )

  if (existing) {
    updateDb((d) => ({
      ...d,
      habit_logs: d.habit_logs.filter((l) => l.id !== existing.id),
    }))
    return false
  }

  const log: HabitLog = {
    id: generateId(),
    habit_id: habitId,
    completed_date: date,
  }
  updateDb((d) => ({ ...d, habit_logs: [...d.habit_logs, log] }))
  return true
}
