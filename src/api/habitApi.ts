import { getDb } from '@/lib/localDb'
import type { Habit, HabitLog } from '@/types'

export async function fetchHabits(userId: string): Promise<Habit[]> {
  return getDb()
    .habits.filter((h) => h.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function fetchTodayHabitLogs(habitIds: string[]): Promise<HabitLog[]> {
  if (habitIds.length === 0) return []
  const today = new Date().toISOString().slice(0, 10)
  return getDb().habit_logs.filter(
    (log) => habitIds.includes(log.habit_id) && log.completed_date === today,
  )
}
