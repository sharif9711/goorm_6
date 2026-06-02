import type { TaskPriority } from '@/types'

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  P1: '매우 중요',
  P2: '중요',
  P3: '보통',
  P4: '낮음',
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  P1: '#ff4d4f',
  P2: '#fa8c16',
  P3: '#1677ff',
  P4: '#8c8c8c',
}

export const PRIORITY_OPTIONS = (['P1', 'P2', 'P3', 'P4'] as TaskPriority[]).map(
  (value) => ({
    value,
    label: `${value} ${PRIORITY_LABELS[value]}`,
  }),
)
