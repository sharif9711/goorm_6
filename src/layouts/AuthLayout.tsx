import { Card } from 'antd'
import { Outlet, Navigate } from 'react-router-dom'
import { CloudOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'

const features = ['일정 · 할 일 통합 관리', '습관 트래커 & 목표 진행률', '생산성 통계 대시보드']

export function AuthLayout() {
  const session = useAuthStore((s) => s.session)
  const initialized = useAuthStore((s) => s.initialized)

  if (initialized && session) {
    return <Navigate to="/app" replace />
  }

  return (
    <div className="goorm-auth-layout">
      <div className="goorm-auth-hero">
        <CloudOutlined style={{ fontSize: 48, marginBottom: 24, opacity: 0.95 }} />
        <h1 className="goorm-auth-hero-title">구름-TODO-LIST</h1>
        <p className="goorm-auth-hero-desc">
          Planet · Notion Calendar · TickTick의 핵심을 하나의 깔끔한 워크스페이스에 담았습니다.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 32, position: 'relative' }}>
          {features.map((text) => (
            <li
              key={text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 12,
                fontSize: 15,
                opacity: 0.95,
              }}
            >
              <CheckCircleOutlined />
              {text}
            </li>
          ))}
        </ul>
      </div>
      <div className="goorm-auth-panel">
        <Card className="goorm-auth-card">
          <Outlet />
        </Card>
      </div>
    </div>
  )
}
