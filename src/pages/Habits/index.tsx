import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Space,
  Spin,
  Statistic,
  Typography,
  message,
  Popconfirm,
} from 'antd'
import { PlusOutlined, DeleteOutlined, FireOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components/common/PageHeader'
import { PageCard } from '@/components/common/PageCard'
import { HabitFormModal, type HabitFormValues } from '@/components/habit/HabitFormModal'
import { HabitContribution } from '@/components/habit/HabitContribution'
import { useAuthUserId } from '@/store/authStore'
import * as habitApi from '@/api/habitApi'
import { calcCompletionRate, calcStreak } from '@/utils/habit'
import type { Habit, HabitLog } from '@/types'

interface HabitWithLogs extends Habit {
  logs: HabitLog[]
  doneToday: boolean
}

export default function HabitsPage() {
  const userId = useAuthUserId()
  const [habits, setHabits] = useState<HabitWithLogs[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const today = new Date().toISOString().slice(0, 10)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const list = await habitApi.fetchHabits(userId)
      const enriched = await Promise.all(
        list.map(async (habit) => {
          const logs = await habitApi.fetchHabitLogs(habit.id)
          return {
            ...habit,
            logs,
            doneToday: logs.some((l) => l.completed_date === today),
          }
        }),
      )
      setHabits(enriched)
    } finally {
      setLoading(false)
    }
  }, [userId, today])

  useEffect(() => {
    void load()
  }, [load])

  const handleCreate = async (values: HabitFormValues) => {
    if (!userId) return
    try {
      await habitApi.createHabit(userId, values)
      message.success('습관이 추가되었습니다')
      setModalOpen(false)
      await load()
    } catch {
      message.error('추가에 실패했습니다')
    }
  }

  const handleToggleToday = async (habit: HabitWithLogs) => {
    try {
      await habitApi.toggleHabitLog(habit.id, today)
      await load()
    } catch {
      message.error('체크에 실패했습니다')
    }
  }

  const handleDelete = async (habitId: string) => {
    try {
      await habitApi.deleteHabit(habitId)
      message.success('습관이 삭제되었습니다')
      await load()
    } catch {
      message.error('삭제에 실패했습니다')
    }
  }

  return (
    <div>
      <PageHeader
        title="습관"
        subtitle="매일 습관을 체크하고 연속 달성일을 기록하세요"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            새 습관
          </Button>
        }
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : habits.length === 0 ? (
        <PageCard>
          <Typography.Text type="secondary">등록된 습관이 없습니다.</Typography.Text>
        </PageCard>
      ) : (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {habits.map((habit) => {
            const streak = calcStreak(habit.logs)
            const rate = calcCompletionRate(habit.logs, habit.target_days)
            const completedDates = new Set(habit.logs.map((l) => l.completed_date))

            return (
              <PageCard
                key={habit.id}
                title={
                  <Space>
                    <Checkbox
                      checked={habit.doneToday}
                      onChange={() => void handleToggleToday(habit)}
                    >
                      {habit.title}
                    </Checkbox>
                  </Space>
                }
                extra={
                  <Popconfirm
                    title="습관을 삭제할까요?"
                    onConfirm={() => void handleDelete(habit.id)}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                }
              >
                <Space size={32} wrap style={{ marginBottom: 16 }}>
                  <Statistic
                    title="연속 달성"
                    value={streak}
                    suffix="일"
                    prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
                  />
                  <Statistic title="주간 달성률" value={rate} suffix="%" />
                </Space>
                <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                  최근 35일
                </Typography.Text>
                <HabitContribution completedDates={completedDates} />
              </PageCard>
            )
          })}
        </Space>
      )}

      <HabitFormModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
