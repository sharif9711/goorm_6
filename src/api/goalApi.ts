import { generateId, getDb, updateDb } from '@/lib/localDb'
import type { Goal } from '@/types'

export interface CreateGoalInput {
  title: string
  target_value: number
  current_value?: number
}

export interface UpdateGoalInput {
  title?: string
  target_value?: number
  current_value?: number
}

export async function fetchGoals(userId: string): Promise<Goal[]> {
  return getDb().goals.filter((g) => g.user_id === userId)
}

export async function createGoal(userId: string, input: CreateGoalInput): Promise<Goal> {
  const goal: Goal = {
    id: generateId(),
    user_id: userId,
    title: input.title,
    target_value: input.target_value,
    current_value: input.current_value ?? 0,
  }
  updateDb((db) => ({ ...db, goals: [...db.goals, goal] }))
  return goal
}

export async function updateGoal(goalId: string, input: UpdateGoalInput): Promise<Goal> {
  let updated: Goal | null = null
  updateDb((db) => {
    const goals = db.goals.map((g) => {
      if (g.id !== goalId) return g
      updated = { ...g, ...input }
      return updated
    })
    return { ...db, goals }
  })
  if (!updated) throw new Error('목표를 찾을 수 없습니다.')
  return updated
}

export async function deleteGoal(goalId: string): Promise<void> {
  updateDb((db) => ({
    ...db,
    goals: db.goals.filter((g) => g.id !== goalId),
  }))
}
