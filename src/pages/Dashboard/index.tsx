import { useEffect, useMemo, useState } from 'react'
import { Card, List, Spin, Typography } from 'antd'
import { PageHeader } from '@/components/common/PageHeader'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { useAuthUserId } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import { fetchTodayEvents } from '@/api/eventApi'
import { fetchNearestDday } from '@/api/ddayApi'
import { getDdayLabel } from '@/utils/date'

export default function DashboardPage() {
  const userId = useAuthUserId()
  const { tasks, fetchTodayTasks } = useTaskStore()
  const [eventCount, setEventCount] = useState(0)
  const [nearestDday, setNearestDday] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    const load = async () => {
      setLoading(true)
      try {
        await fetchTodayTasks(userId)
        const events = await fetchTodayEvents(userId)
        setEventCount(events.length)

        const dday = await fetchNearestDday(userId)
        setNearestDday(dday ? getDdayLabel(dday.target_date) : null)
      } catch {
        setEventCount(0)
        setNearestDday(null)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [userId, fetchTodayTasks])

  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0
    const completed = tasks.filter((t) => t.status === 'completed').length
    return Math.round((completed / tasks.length) * 100)
  }, [tasks])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="대시보드"
        subtitle="오늘의 생산성을 한눈에 확인하세요"
      />
      <DashboardStats
        todayTaskCount={tasks.length}
        todayEventCount={eventCount}
        nearestDday={nearestDday}
        habitCompletionRate={0}
        weeklyProductivity={completionRate}
      />
      <Card title="오늘 할 일 미리보기" style={{ marginTop: 16 }}>
        {tasks.length === 0 ? (
          <Typography.Text type="secondary">오늘 마감인 할 일이 없습니다.</Typography.Text>
        ) : (
          <List
            size="small"
            dataSource={tasks.slice(0, 5)}
            renderItem={(task) => (
              <List.Item>
                <Typography.Text delete={task.status === 'completed'}>
                  {task.title}
                </Typography.Text>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  )
}
