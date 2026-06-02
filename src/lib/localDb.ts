import type { LocalSession } from '@/types/auth'
import type {
  Category,
  Dday,
  Event,
  Goal,
  Habit,
  HabitLog,
  Task,
  UserProfile,
} from '@/types'

const STORAGE_KEY = 'goorm-todo-local-db'

interface LocalAccount {
  user_id: string
  email: string
  password: string
}

export interface LocalDatabase {
  users: UserProfile[]
  accounts: LocalAccount[]
  session: LocalSession | null
  tasks: Task[]
  events: Event[]
  habits: Habit[]
  habit_logs: HabitLog[]
  goals: Goal[]
  ddays: Dday[]
  categories: Category[]
}

function emptyDb(): LocalDatabase {
  return {
    users: [],
    accounts: [],
    session: null,
    tasks: [],
    events: [],
    habits: [],
    habit_logs: [],
    goals: [],
    ddays: [],
    categories: [],
  }
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function getDb(): LocalDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedDemoData()
    const parsed = JSON.parse(raw) as LocalDatabase
    return { ...emptyDb(), ...parsed }
  } catch {
    return seedDemoData()
  }
}

export function saveDb(patch: Partial<LocalDatabase>): LocalDatabase {
  const next = { ...getDb(), ...patch }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function updateDb(updater: (db: LocalDatabase) => LocalDatabase): LocalDatabase {
  const next = updater(getDb())
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

function seedDemoData(): LocalDatabase {
  const userId = generateId()
  const now = new Date()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const noon = new Date()
  noon.setHours(14, 0, 0, 0)
  const evening = new Date()
  evening.setHours(18, 0, 0, 0)

  const user: UserProfile = {
    id: userId,
    email: 'demo@goorm.com',
    nickname: '구름 데모',
    avatar_url: null,
    created_at: now.toISOString(),
  }

  const tasks: Task[] = [
    {
      id: generateId(),
      user_id: userId,
      title: '오늘 할 일 정리하기',
      description: 'TickTick 스타일 Today 뷰 확인',
      priority: 'P1',
      status: 'pending',
      due_date: noon.toISOString(),
      repeat_type: 'none',
      category_id: null,
      sort_order: 0,
      created_at: now.toISOString(),
    },
    {
      id: generateId(),
      user_id: userId,
      title: '프로젝트 README 작성',
      description: null,
      priority: 'P2',
      status: 'pending',
      due_date: evening.toISOString(),
      repeat_type: 'none',
      category_id: null,
      sort_order: 1,
      created_at: now.toISOString(),
    },
    {
      id: generateId(),
      user_id: userId,
      title: '운동 30분',
      description: null,
      priority: 'P3',
      status: 'completed',
      due_date: todayStart.toISOString(),
      repeat_type: 'daily',
      category_id: null,
      sort_order: 2,
      created_at: now.toISOString(),
    },
  ]

  const eventStart = new Date()
  eventStart.setHours(10, 0, 0, 0)
  const eventEnd = new Date()
  eventEnd.setHours(10, 30, 0, 0)

  const events: Event[] = [
    {
      id: generateId(),
      user_id: userId,
      title: '팀 스탠드업',
      description: '15분',
      start_time: eventStart.toISOString(),
      end_time: eventEnd.toISOString(),
      category_id: null,
    },
  ]

  const ddays: Dday[] = [
    {
      id: generateId(),
      user_id: userId,
      title: '프로젝트 오픈',
      target_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30)
        .toISOString()
        .slice(0, 10),
    },
  ]

  const session: LocalSession = {
    user: {
      id: userId,
      email: user.email,
      user_metadata: { nickname: user.nickname ?? undefined },
    },
    access_token: 'local-demo-token',
  }

  const db: LocalDatabase = {
    users: [user],
    accounts: [{ user_id: userId, email: 'demo@goorm.com', password: 'demo1234' }],
    session,
    tasks,
    events,
    habits: [],
    habit_logs: [],
    goals: [],
    ddays,
    categories: [],
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  return db
}

export function resetDemoData(): LocalDatabase {
  localStorage.removeItem(STORAGE_KEY)
  return seedDemoData()
}
