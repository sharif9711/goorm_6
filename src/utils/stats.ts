import { getDb } from '@/lib/localDb'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '@/utils/priority'
import { dayjs } from '@/utils/date'
import type { ProductivityStats, TaskPriority } from '@/types'

function taskScoreForDay(userId: string, date: string): number {
  const tasks = getDb().tasks.filter((t) => t.user_id === userId)
  const dayTasks = tasks.filter((t) => {
    if (t.status !== 'completed') return false
    const completedAt = t.due_date ?? t.created_at
    return dayjs(completedAt).format('YYYY-MM-DD') === date
  })
  const dueToday = tasks.filter(
    (t) => t.due_date && dayjs(t.due_date).format('YYYY-MM-DD') === date,
  )
  if (dueToday.length === 0) return dayTasks.length > 0 ? 80 : 50
  return Math.round((dayTasks.length / dueToday.length) * 100)
}

function habitScoreForDay(userId: string, date: string): number {
  const db = getDb()
  const habits = db.habits.filter((h) => h.user_id === userId)
  if (habits.length === 0) return 0
  const done = db.habit_logs.filter(
    (l) => l.completed_date === date && habits.some((h) => h.id === l.habit_id),
  ).length
  return Math.round((done / habits.length) * 100)
}

function eventScoreForWeek(userId: string): number {
  const start = dayjs().subtract(6, 'day').startOf('day')
  const events = getDb().events.filter(
    (e) => e.user_id === userId && dayjs(e.start_time).isAfter(start),
  )
  if (events.length === 0) return 70
  return Math.min(100, 60 + events.length * 8)
}

export function calculateProductivityStats(userId: string): ProductivityStats {
  const db = getDb()
  const tasks = db.tasks.filter((t) => t.user_id === userId)
  const habits = db.habits.filter((h) => h.user_id === userId)
  const today = dayjs().format('YYYY-MM-DD')

  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const taskRate = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0

  const habitLogsToday = db.habit_logs.filter(
    (l) =>
      l.completed_date === today && habits.some((h) => h.id === l.habit_id),
  )
  const habitRate = habits.length
    ? Math.round((habitLogsToday.length / habits.length) * 100)
    : 0

  const eventRate = eventScoreForWeek(userId)

  const score = Math.round(taskRate * 0.5 + habitRate * 0.3 + eventRate * 0.2)

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().subtract(6 - i, 'day')
    const label = d.format('ddd')
    const date = d.format('YYYY-MM-DD')
    const tScore = taskScoreForDay(userId, date)
    const hScore = habitScoreForDay(userId, date)
    const dayScore = Math.round(tScore * 0.6 + hScore * 0.4)
    const tasksDone = db.tasks.filter(
      (t) =>
        t.user_id === userId &&
        t.status === 'completed' &&
        dayjs(t.due_date ?? t.created_at).format('YYYY-MM-DD') === date,
    ).length
    return { label, score: dayScore, tasks: tasksDone }
  })

  const monthlyData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = dayjs().subtract(3 - i, 'week').startOf('week')
    const label = `${weekStart.format('M/D')}주`
    let sum = 0
    for (let d = 0; d < 7; d++) {
      const date = weekStart.add(d, 'day').format('YYYY-MM-DD')
      sum += taskScoreForDay(userId, date) * 0.6 + habitScoreForDay(userId, date) * 0.4
    }
    return { label, score: Math.round(sum / 7) }
  })

  const priorities: TaskPriority[] = ['P1', 'P2', 'P3', 'P4']
  const categoryData = priorities
    .map((p) => ({
      name: PRIORITY_LABELS[p],
      value: tasks.filter((t) => t.priority === p && t.status === 'completed').length,
      color: PRIORITY_COLORS[p],
    }))
    .filter((c) => c.value > 0)

  const topCategory =
    categoryData.sort((a, b) => b.value - a.value)[0]?.name ?? '없음'

  return {
    score,
    taskRate,
    habitRate,
    eventRate,
    topCategory,
    weeklyData,
    monthlyData,
    categoryData: categoryData.length ? categoryData : [{ name: '데이터 없음', value: 1, color: '#d9d9d9' }],
  }
}
