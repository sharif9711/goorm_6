import { generateId, getDb, updateDb } from '@/lib/localDb'
import type { Dday } from '@/types'

export interface CreateDdayInput {
  title: string
  target_date: string
}

export interface UpdateDdayInput extends Partial<CreateDdayInput> {}

export async function fetchDdays(userId: string): Promise<Dday[]> {
  return getDb()
    .ddays.filter((d) => d.user_id === userId)
    .sort((a, b) => a.target_date.localeCompare(b.target_date))
}

export async function fetchNearestDday(userId: string): Promise<Dday | null> {
  const ddays = await fetchDdays(userId)
  return ddays[0] ?? null
}

export async function createDday(userId: string, input: CreateDdayInput): Promise<Dday> {
  const dday: Dday = {
    id: generateId(),
    user_id: userId,
    title: input.title,
    target_date: input.target_date,
  }
  updateDb((db) => ({ ...db, ddays: [...db.ddays, dday] }))
  return dday
}

export async function updateDday(ddayId: string, input: UpdateDdayInput): Promise<Dday> {
  let updated: Dday | null = null
  updateDb((db) => {
    const ddays = db.ddays.map((d) => {
      if (d.id !== ddayId) return d
      updated = { ...d, ...input }
      return updated
    })
    return { ...db, ddays }
  })
  if (!updated) throw new Error('D-Day를 찾을 수 없습니다.')
  return updated
}

export async function deleteDday(ddayId: string): Promise<void> {
  updateDb((db) => ({
    ...db,
    ddays: db.ddays.filter((d) => d.id !== ddayId),
  }))
}
