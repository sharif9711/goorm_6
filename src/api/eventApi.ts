import { generateId, getDb, updateDb } from '@/lib/localDb'
import type { Event } from '@/types'

export interface CreateEventInput {
  title: string
  description?: string | null
  start_time: string
  end_time: string
  category_id?: string | null
}

export interface UpdateEventInput extends Partial<CreateEventInput> {}

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

export async function createEvent(userId: string, input: CreateEventInput): Promise<Event> {
  const event: Event = {
    id: generateId(),
    user_id: userId,
    title: input.title,
    description: input.description ?? null,
    start_time: input.start_time,
    end_time: input.end_time,
    category_id: input.category_id ?? null,
  }
  updateDb((db) => ({ ...db, events: [...db.events, event] }))
  return event
}

export async function updateEvent(eventId: string, input: UpdateEventInput): Promise<Event> {
  let updated: Event | null = null
  updateDb((db) => {
    const events = db.events.map((e) => {
      if (e.id !== eventId) return e
      updated = { ...e, ...input }
      return updated
    })
    return { ...db, events }
  })
  if (!updated) throw new Error('일정을 찾을 수 없습니다.')
  return updated
}

export async function deleteEvent(eventId: string): Promise<void> {
  updateDb((db) => ({
    ...db,
    events: db.events.filter((e) => e.id !== eventId),
  }))
}
