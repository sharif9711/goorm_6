import { Tooltip } from 'antd'
import { getLastNDates } from '@/utils/habit'

interface HabitContributionProps {
  completedDates: Set<string>
  days?: number
}

export function HabitContribution({ completedDates, days = 35 }: HabitContributionProps) {
  const dates = getLastNDates(days)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {dates.map((date) => {
        const done = completedDates.has(date)
        return (
          <Tooltip key={date} title={date}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: done ? '#52c41a' : '#f0f0f0',
                border: '1px solid #d9d9d9',
              }}
            />
          </Tooltip>
        )
      })}
    </div>
  )
}
