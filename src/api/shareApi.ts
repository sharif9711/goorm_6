import { generateId, getDb, updateDb } from '@/lib/localDb'
import type { ShareMember, ShareRole, SharedCalendar } from '@/types'

export interface SharedCalendarWithMembers extends SharedCalendar {
  members: ShareMember[]
  isOwner: boolean
}

const ROLE_LABELS: Record<ShareRole, string> = {
  read: '읽기',
  edit: '편집',
  admin: '관리자',
}

export function getRoleLabel(role: ShareRole): string {
  return ROLE_LABELS[role]
}

export async function fetchSharedCalendars(userId: string): Promise<SharedCalendarWithMembers[]> {
  const db = getDb()
  const owned = db.shared_calendars.filter((c) => c.owner_id === userId)
  const memberCalIds = db.share_members
    .filter((m) => m.user_id === userId || m.email === db.users.find((u) => u.id === userId)?.email)
    .map((m) => m.calendar_id)

  const memberCals = db.shared_calendars.filter(
    (c) => memberCalIds.includes(c.id) && c.owner_id !== userId,
  )

  const all = [...owned, ...memberCals]
  const unique = Array.from(new Map(all.map((c) => [c.id, c])).values())

  return unique.map((cal) => ({
    ...cal,
    members: db.share_members.filter((m) => m.calendar_id === cal.id),
    isOwner: cal.owner_id === userId,
  }))
}

export async function createSharedCalendar(
  userId: string,
  name: string,
): Promise<SharedCalendar> {
  const calendar: SharedCalendar = {
    id: generateId(),
    owner_id: userId,
    name,
    invite_token: generateId().replace(/-/g, '').slice(0, 12),
    created_at: new Date().toISOString(),
  }
  updateDb((db) => ({
    ...db,
    shared_calendars: [...db.shared_calendars, calendar],
  }))
  return calendar
}

export async function inviteMember(
  calendarId: string,
  email: string,
  role: ShareRole,
): Promise<ShareMember> {
  const normalized = email.trim().toLowerCase()
  const db = getDb()
  const exists = db.share_members.find(
    (m) => m.calendar_id === calendarId && m.email.toLowerCase() === normalized,
  )
  if (exists) throw new Error('이미 초대된 이메일입니다.')

  const matchedUser = db.users.find((u) => u.email.toLowerCase() === normalized)
  const member: ShareMember = {
    id: generateId(),
    calendar_id: calendarId,
    email: normalized,
    role,
    user_id: matchedUser?.id ?? null,
  }
  updateDb((d) => ({ ...d, share_members: [...d.share_members, member] }))
  return member
}

export async function updateMemberRole(memberId: string, role: ShareRole): Promise<void> {
  updateDb((db) => ({
    ...db,
    share_members: db.share_members.map((m) => (m.id === memberId ? { ...m, role } : m)),
  }))
}

export async function removeMember(memberId: string): Promise<void> {
  updateDb((db) => ({
    ...db,
    share_members: db.share_members.filter((m) => m.id !== memberId),
  }))
}

export async function deleteSharedCalendar(calendarId: string, userId: string): Promise<void> {
  const cal = getDb().shared_calendars.find((c) => c.id === calendarId)
  if (!cal || cal.owner_id !== userId) throw new Error('삭제 권한이 없습니다.')
  updateDb((db) => ({
    ...db,
    shared_calendars: db.shared_calendars.filter((c) => c.id !== calendarId),
    share_members: db.share_members.filter((m) => m.calendar_id !== calendarId),
  }))
}

export function buildInviteLink(token: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return `${base}/app/share?join=${token}`
}

export async function joinByInviteToken(userId: string, token: string): Promise<SharedCalendar> {
  const db = getDb()
  const calendar = db.shared_calendars.find((c) => c.invite_token === token.trim())
  if (!calendar) throw new Error('유효하지 않은 초대 링크입니다.')

  const user = db.users.find((u) => u.id === userId)
  if (!user) throw new Error('사용자를 찾을 수 없습니다.')
  if (calendar.owner_id === userId) return calendar

  const exists = db.share_members.find(
    (m) => m.calendar_id === calendar.id && m.email === user.email.toLowerCase(),
  )
  if (!exists) {
    await inviteMember(calendar.id, user.email, 'read')
  }
  return calendar
}
