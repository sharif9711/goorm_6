import { Tag } from 'antd'
import type { TaskPriority } from '@/types'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '@/utils/priority'

interface PriorityTagProps {
  priority: TaskPriority
}

export function PriorityTag({ priority }: PriorityTagProps) {
  return (
    <Tag color={PRIORITY_COLORS[priority]} style={{ margin: 0 }}>
      {priority} {PRIORITY_LABELS[priority]}
    </Tag>
  )
}
