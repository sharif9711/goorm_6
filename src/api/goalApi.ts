import { getDb } from '@/lib/localDb'
import type { Goal } from '@/types'

export async function fetchGoals(userId: string): Promise<Goal[]> {
  return getDb().goals.filter((g) => g.user_id === userId)
}
