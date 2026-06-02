import { Card, Col, Progress, Row } from 'antd'
import {
  CheckSquareOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import { PageCard } from '@/components/common/PageCard'

interface DashboardStatsProps {
  todayTaskCount: number
  todayEventCount: number
  nearestDday: string | null
  habitCompletionRate: number
  weeklyProductivity: number
}

function StatCard({
  icon,
  iconClass,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode
  iconClass: string
  label: string
  value: string | number
  suffix?: string
}) {
  return (
    <Card className="goorm-stat-card">
      <div className={`goorm-stat-icon ${iconClass}`}>{icon}</div>
      <div className="goorm-stat-label">{label}</div>
      <div className="goorm-stat-value">
        {value}
        {suffix && (
          <span style={{ fontSize: 16, fontWeight: 500, marginLeft: 4 }}>{suffix}</span>
        )}
      </div>
    </Card>
  )
}

export function DashboardStats({
  todayTaskCount,
  todayEventCount,
  nearestDday,
  habitCompletionRate,
  weeklyProductivity,
}: DashboardStatsProps) {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<CheckSquareOutlined />}
            iconClass="goorm-stat-icon--blue"
            label="오늘 할 일"
            value={todayTaskCount}
            suffix="개"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<CalendarOutlined />}
            iconClass="goorm-stat-icon--green"
            label="오늘 일정"
            value={todayEventCount}
            suffix="개"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<ClockCircleOutlined />}
            iconClass="goorm-stat-icon--orange"
            label="가장 가까운 D-Day"
            value={nearestDday ?? '-'}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="goorm-stat-card">
            <div className="goorm-stat-icon goorm-stat-icon--red">
              <FireOutlined />
            </div>
            <div className="goorm-stat-label">습관 달성률</div>
            <Progress
              percent={habitCompletionRate}
              strokeColor="#EF4444"
              showInfo
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>
      <PageCard style={{ marginTop: 16 }} title="이번 주 생산성">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <RiseOutlined style={{ fontSize: 24, color: '#5B6CFF' }} />
          <span className="goorm-stat-value">{weeklyProductivity}%</span>
        </div>
        <Progress
          percent={weeklyProductivity}
          status={weeklyProductivity >= 80 ? 'success' : 'active'}
          strokeColor={{ '0%': '#5B6CFF', '100%': '#8B5CF6' }}
          strokeWidth={12}
        />
      </PageCard>
    </>
  )
}
