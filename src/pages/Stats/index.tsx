import { useEffect, useState } from 'react'
import { Col, Row, Spin, Statistic, Typography } from 'antd'
import { PageCard } from '@/components/common/PageCard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { PageHeader } from '@/components/common/PageHeader'
import { useAuthUserId } from '@/store/authStore'
import { calculateProductivityStats } from '@/utils/stats'
import type { ProductivityStats } from '@/types'

export default function StatsPage() {
  const userId = useAuthUserId()
  const [stats, setStats] = useState<ProductivityStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    try {
      setStats(calculateProductivityStats(userId))
    } finally {
      setLoading(false)
    }
  }, [userId])

  if (loading || !stats) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="통계" subtitle="생산성 점수와 차트를 확인하세요" />

      <div className="goorm-score-hero">
        <Typography.Text type="secondary">이번 주 생산성 점수</Typography.Text>
        <div className="goorm-score-value">{stats.score}</div>
        <Typography.Text type="secondary" style={{ fontSize: 15 }}>
          점 · 가장 많이 완료: {stats.topCategory}
        </Typography.Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <PageCard>
            <Statistic title="할 일 완료율" value={stats.taskRate} suffix="%" />
          </PageCard>
        </Col>
        <Col xs={24} sm={8}>
          <PageCard>
            <Statistic title="습관 달성률 (오늘)" value={stats.habitRate} suffix="%" />
          </PageCard>
        </Col>
        <Col xs={24} sm={8}>
          <PageCard>
            <Statistic title="일정 이행률" value={stats.eventRate} suffix="%" />
          </PageCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <PageCard title="주간 생산성">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" name="생산성" fill="#1677ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </PageCard>
        </Col>
        <Col xs={24} lg={12}>
          <PageCard title="월간 생산성 (주별)">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" name="생산성" fill="#52c41a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </PageCard>
        </Col>
        <Col xs={24}>
          <PageCard title="우선순위별 완료 분석">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {stats.categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </PageCard>
        </Col>
      </Row>
    </div>
  )
}
