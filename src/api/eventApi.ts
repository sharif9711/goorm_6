import { getDb } from '@/lib/localDb'
import type { Event } from '@/types'

export async function fetchEvents(userId: string): Promise<Event[]> {
  return getDb()
    .events.filter((e) => e.user_id === userId)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
}

export async function fetchTodayEvents(userId: string): Promise<Event[]> {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)

  return getDb().events.filter((e) => {
    if (e.user_id !== userId) return false
    const time = new Date(e.start_time).getTime()
    return time >= start.getTime() && time <= end.getTime()
  })
}
