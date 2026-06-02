import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export function isToday(date: string | null): boolean {
  if (!date) return false
  return dayjs(date).isSame(dayjs(), 'day')
}

export function formatDueDate(date: string | null): string {
  if (!date) return '마감일 없음'
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

export function getDdayLabel(targetDate: string): string {
  const diff = dayjs(targetDate).startOf('day').diff(dayjs().startOf('day'), 'day')
  if (diff > 0) return `D-${diff}`
  if (diff < 0) return `D+${Math.abs(diff)}`
  return 'D-Day'
}

export { dayjs }
