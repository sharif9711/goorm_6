import { useEffect, useState } from 'react'
import { Card, Col, Row, Spin, Statistic, Typography } from 'antd'
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

      <Card style={{ marginBottom: 16, textAlign: 'center' }}>
        <Typography.Text type="secondary">이번 주 생산성 점수</Typography.Text>
        <Typography.Title level={1} style={{ margin: '8px 0', color: '#1677ff' }}>
          {stats.score}점
        </Typography.Title>
        <Typography.Text type="secondary">
          가장 많이 완료한 카테고리: {stats.topCategory}
        </Typography.Text>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="할 일 완료율" value={stats.taskRate} suffix="%" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="습관 달성률 (오늘)" value={stats.habitRate} suffix="%" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="일정 이행률" value={stats.eventRate} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="주간 생산성">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" name="생산성" fill="#1677ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="월간 생산성 (주별)">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" name="생산성" fill="#52c41a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="우선순위별 완료 분석">
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
          </Card>
        </Col>
      </Row>
    </div>
  )
}
