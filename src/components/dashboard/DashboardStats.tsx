import { Card, Col, Row, Statistic, Progress } from 'antd'
import {
  CheckSquareOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from '@ant-design/icons'

interface DashboardStatsProps {
  todayTaskCount: number
  todayEventCount: number
  nearestDday: string | null
  habitCompletionRate: number
  weeklyProductivity: number
}

export function DashboardStats({
  todayTaskCount,
  todayEventCount,
  nearestDday,
  habitCompletionRate,
  weeklyProductivity,
}: DashboardStatsProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="오늘 할 일"
            value={todayTaskCount}
            suffix="개"
            prefix={<CheckSquareOutlined style={{ color: '#1677ff' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="오늘 일정"
            value={todayEventCount}
            suffix="개"
            prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="가장 가까운 D-Day"
            value={nearestDday ?? '-'}
            prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <div style={{ marginBottom: 8 }}>
            <FireOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            습관 달성률
          </div>
          <Progress percent={habitCompletionRate} size="small" />
        </Card>
      </Col>
      <Col xs={24}>
        <Card title="이번 주 생산성">
          <Progress
            percent={weeklyProductivity}
            status={weeklyProductivity >= 80 ? 'success' : 'active'}
            strokeColor={{ '0%': '#1677ff', '100%': '#52c41a' }}
          />
        </Card>
      </Col>
    </Row>
  )
}
