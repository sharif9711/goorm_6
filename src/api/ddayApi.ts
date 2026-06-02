import { getDb } from '@/lib/localDb'
import type { Dday } from '@/types'

export async function fetchDdays(userId: string): Promise<Dday[]> {
  return getDb()
    .ddays.filter((d) => d.user_id === userId)
    .sort((a, b) => a.target_date.localeCompare(b.target_date))
}

export async function fetchNearestDday(userId: string): Promise<Dday | null> {
  const ddays = await fetchDdays(userId)
  return ddays[0] ?? null
}
