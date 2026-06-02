export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4'
export type TaskStatus = 'pending' | 'completed' | 'cancelled'
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly'

export interface UserProfile {
  id: string
  email: string
  nickname: string | null
  avatar_url: string | null
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  priority: TaskPriority
  status: TaskStatus
  due_date: string | null
  repeat_type: RepeatType
  category_id: string | null
  sort_order: number
  created_at: string
}

export interface Event {
  id: string
  user_id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  category_id: string | null
}

export interface Habit {
  id: string
  user_id: string
  title: string
  target_days: number
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  completed_date: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  target_value: number
  current_value: number
}

export interface Dday {
  id: string
  user_id: string
  title: string
  target_date: string
}

export type ThemeMode = 'light' | 'dark'

export type ShareRole = 'read' | 'edit' | 'admin'

export interface SharedCalendar {
  id: string
  owner_id: string
  name: string
  invite_token: string
  created_at: string
}

export interface ShareMember {
  id: string
  calendar_id: string
  email: string
  role: ShareRole
  user_id: string | null
}

export interface ProductivityStats {
  score: number
  taskRate: number
  habitRate: number
  eventRate: number
  topCategory: string
  weeklyData: { label: string; score: number; tasks: number }[]
  monthlyData: { label: string; score: number }[]
  categoryData: { name: string; value: number; color: string }[]
}
