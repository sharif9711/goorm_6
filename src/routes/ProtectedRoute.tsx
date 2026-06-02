import { Navigate, Outlet } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute() {
  const session = useAuthStore((s) => s.session)
  const initialized = useAuthStore((s) => s.initialized)

  if (!initialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
