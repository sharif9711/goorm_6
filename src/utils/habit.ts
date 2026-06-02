import { dayjs } from '@/utils/date'
import type { HabitLog } from '@/types'

export function calcStreak(logs: HabitLog[]): number {
  const dates = new Set(logs.map((l) => l.completed_date))
  let streak = 0
  let cursor = dayjs().startOf('day')

  while (dates.has(cursor.format('YYYY-MM-DD'))) {
    streak += 1
    cursor = cursor.subtract(1, 'day')
  }

  return streak
}

export function calcCompletionRate(logs: HabitLog[], targetDays: number): number {
  if (targetDays <= 0) return 0
  const cutoff = dayjs().subtract(targetDays - 1, 'day').format('YYYY-MM-DD')
  const count = logs.filter((l) => l.completed_date >= cutoff).length
  return Math.min(100, Math.round((count / targetDays) * 100))
}

export function getLastNDates(n: number): string[] {
  const dates: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    dates.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'))
  }
  return dates
}
