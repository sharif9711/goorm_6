import { Layout, Typography } from 'antd'
import { Outlet, Navigate } from 'react-router-dom'
import { CloudOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'

const { Content } = Layout

export function AuthLayout() {
  const session = useAuthStore((s) => s.session)
  const initialized = useAuthStore((s) => s.initialized)

  if (initialized && session) {
    return <Navigate to="/app" replace />
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <CloudOutlined style={{ fontSize: 48, color: '#1677ff' }} />
          <Typography.Title level={2} style={{ marginTop: 16, marginBottom: 0 }}>
            구름-TODO-LIST
          </Typography.Title>
          <Typography.Text type="secondary">
            일정 · 할 일 · 습관 · 목표를 한곳에서
          </Typography.Text>
        </div>
        <Outlet />
      </Content>
    </Layout>
  )
}
