import { generateId, getDb, updateDb } from '@/lib/localDb'
import type { LocalSession } from '@/types/auth'
import type { UserProfile } from '@/types'

function toSession(user: UserProfile): LocalSession {
  return {
    user: {
      id: user.id,
      email: user.email,
      user_metadata: { nickname: user.nickname ?? undefined },
    },
    access_token: `local-${user.id}`,
  }
}

function findAccount(email: string) {
  return getDb().accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())
}

export async function signUp(email: string, password: string, nickname: string) {
  if (findAccount(email)) throw new Error('이미 가입된 이메일입니다.')

  const id = generateId()
  const user: UserProfile = {
    id,
    email,
    nickname,
    avatar_url: null,
    created_at: new Date().toISOString(),
  }
  const session = toSession(user)

  updateDb((db) => ({
    ...db,
    users: [...db.users, user],
    accounts: [...db.accounts, { user_id: id, email, password }],
    session,
  }))

  notifyAuthChange('SIGNED_UP')
  return { session, user: session.user }
}

export async function signIn(email: string, password: string) {
  const account = findAccount(email)
  if (!account || account.password !== password) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  const user = getDb().users.find((u) => u.id === account.user_id)
  if (!user) throw new Error('사용자를 찾을 수 없습니다.')

  const session = toSession(user)
  updateDb((d) => ({ ...d, session }))
  notifyAuthChange('SIGNED_IN')
  return { session, user: session.user }
}

export async function signOut() {
  updateDb((db) => ({ ...db, session: null }))
  notifyAuthChange('SIGNED_OUT')
}

export async function getSession(): Promise<LocalSession | null> {
  return getDb().session
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  return getDb().users.find((u) => u.id === userId) ?? null
}

export async function upsertProfile(
  profile: Partial<UserProfile> & { id: string },
): Promise<UserProfile> {
  let result: UserProfile | null = null

  updateDb((db) => {
    const idx = db.users.findIndex((u) => u.id === profile.id)
    const existing = idx >= 0 ? db.users[idx] : null
    const merged: UserProfile = {
      id: profile.id,
      email: profile.email ?? existing?.email ?? '',
      nickname: profile.nickname ?? existing?.nickname ?? null,
      avatar_url: profile.avatar_url ?? existing?.avatar_url ?? null,
      created_at: existing?.created_at ?? new Date().toISOString(),
    }
    const users = [...db.users]
    if (idx >= 0) users[idx] = merged
    else users.push(merged)
    result = merged
    return { ...db, users }
  })

  return result!
}

type AuthListener = (event: string, session: LocalSession | null) => void
const listeners = new Set<AuthListener>()

function notifyAuthChange(event: string) {
  const session = getDb().session
  listeners.forEach((cb) => cb(event, session))
}

export function onAuthStateChange(callback: AuthListener) {
  listeners.add(callback)
  return {
    data: {
      subscription: {
        unsubscribe: () => {
          listeners.delete(callback)
        },
      },
    },
  }
}
