import { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, theme, Drawer } from 'antd'
import {
  DashboardOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  FlagOutlined,
  FireOutlined,
  ClockCircleOutlined,
  ShareAltOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  UserOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useSettingStore } from '@/store/settingStore'
import { useIsMobile } from '@/hooks/useMediaQuery'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/app', icon: <DashboardOutlined />, label: '대시보드' },
  { key: '/app/today', icon: <ThunderboltOutlined />, label: '오늘' },
  { key: '/app/calendar', icon: <CalendarOutlined />, label: '캘린더' },
  { key: '/app/tasks', icon: <CheckSquareOutlined />, label: '할일' },
  { key: '/app/goals', icon: <FlagOutlined />, label: '목표' },
  { key: '/app/habits', icon: <FireOutlined />, label: '습관' },
  { key: '/app/dday', icon: <ClockCircleOutlined />, label: 'D-Day' },
  { key: '/app/share', icon: <ShareAltOutlined />, label: '공유' },
  { key: '/app/stats', icon: <BarChartOutlined />, label: '통계' },
  { key: '/app/settings', icon: <SettingOutlined />, label: '설정' },
]

function SidebarMenu({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname === '/app/' ? '/app' : location.pathname]}
      items={menuItems}
      onClick={({ key }) => {
        navigate(key)
        onNavigate?.()
      }}
      style={{ borderInlineEnd: 0, flex: 1 }}
    />
  )
}

export function AppLayout() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { token } = theme.useToken()
  const profile = useAuthStore((s) => s.profile)
  const logout = useAuthStore((s) => s.logout)
  const sidebarCollapsed = useSettingStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useSettingStore((s) => s.setSidebarCollapsed)
  const toggleTheme = useSettingStore((s) => s.toggleTheme)
  const themeMode = useSettingStore((s) => s.theme)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const siderWidth = isMobile ? 0 : sidebarCollapsed ? 80 : 220

  const userMenu = {
    items: [
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '설정',
        onClick: () => navigate('/app/settings'),
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '로그아웃',
        onClick: () => void logout().then(() => navigate('/login')),
      },
    ],
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider
          collapsible
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          width={220}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: sidebarCollapsed ? 14 : 18,
              color: token.colorPrimary,
            }}
          >
            {sidebarCollapsed ? '구름' : '구름-TODO'}
          </div>
          <SidebarMenu />
        </Sider>
      )}

      <Layout style={{ marginLeft: siderWidth, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            background: token.colorBgContainer,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setDrawerOpen(true)}
              />
            ) : (
              <Button
                type="text"
                icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              type="text"
              icon={themeMode === 'light' ? <MoonOutlined /> : <SunOutlined />}
              onClick={toggleTheme}
            />
            <Dropdown menu={userMenu} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<UserOutlined />} src={profile?.avatar_url ?? undefined} />
                {!isMobile && <span>{profile?.nickname ?? profile?.email}</span>}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: isMobile ? 12 : 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>

      <Drawer
        title="구름-TODO-LIST"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{ body: { padding: 0 } }}
      >
        <SidebarMenu onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
    </Layout>
  )
}
