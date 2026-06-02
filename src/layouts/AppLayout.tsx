import { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Drawer, Typography } from 'antd'
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
  CloudOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { useAuthStore } from '@/store/authStore'
import { useSettingStore } from '@/store/settingStore'
import { useIsMobile } from '@/hooks/useMediaQuery'

const { Header, Sider, Content } = Layout

const menuItems: MenuProps['items'] = [
  {
    type: 'group',
    label: '홈',
    children: [
      { key: '/app', icon: <DashboardOutlined />, label: '대시보드' },
      { key: '/app/today', icon: <ThunderboltOutlined />, label: '오늘' },
    ],
  },
  {
    type: 'group',
    label: '관리',
    children: [
      { key: '/app/calendar', icon: <CalendarOutlined />, label: '캘린더' },
      { key: '/app/tasks', icon: <CheckSquareOutlined />, label: '할일' },
      { key: '/app/goals', icon: <FlagOutlined />, label: '목표' },
      { key: '/app/habits', icon: <FireOutlined />, label: '습관' },
      { key: '/app/dday', icon: <ClockCircleOutlined />, label: 'D-Day' },
    ],
  },
  {
    type: 'group',
    label: '더보기',
    children: [
      { key: '/app/share', icon: <ShareAltOutlined />, label: '공유' },
      { key: '/app/stats', icon: <BarChartOutlined />, label: '통계' },
      { key: '/app/settings', icon: <SettingOutlined />, label: '설정' },
    ],
  },
]

function SidebarMenu({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname.replace(/\/$/, '') || '/app'

  return (
    <Menu
      mode="inline"
      selectedKeys={[path === '/app' ? '/app' : path]}
      items={menuItems}
      onClick={({ key }) => {
        navigate(key)
        onNavigate?.()
      }}
      className="goorm-sider-menu"
      style={{ borderInlineEnd: 0, background: 'transparent' }}
    />
  )
}

function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="goorm-sider-logo">
      <div className="goorm-sider-logo-icon">
        <CloudOutlined />
      </div>
      {!collapsed && <span className="goorm-sider-logo-text">구름 TODO</span>}
    </div>
  )
}

function CollapsedNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname.replace(/\/$/, '') || '/app'

  const items = [
    { key: '/app', icon: <DashboardOutlined /> },
    { key: '/app/today', icon: <ThunderboltOutlined /> },
    { key: '/app/calendar', icon: <CalendarOutlined /> },
    { key: '/app/tasks', icon: <CheckSquareOutlined /> },
    { key: '/app/goals', icon: <FlagOutlined /> },
    { key: '/app/habits', icon: <FireOutlined /> },
    { key: '/app/stats', icon: <BarChartOutlined /> },
    { key: '/app/settings', icon: <SettingOutlined /> },
  ]

  return (
    <Menu
      mode="inline"
      selectedKeys={[path]}
      style={{ border: 0, background: 'transparent' }}
      items={items}
      onClick={({ key }) => navigate(key)}
    />
  )
}

export function AppLayout() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const profile = useAuthStore((s) => s.profile)
  const logout = useAuthStore((s) => s.logout)
  const sidebarCollapsed = useSettingStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useSettingStore((s) => s.setSidebarCollapsed)
  const toggleTheme = useSettingStore((s) => s.toggleTheme)
  const themeMode = useSettingStore((s) => s.theme)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const siderWidth = isMobile ? 0 : sidebarCollapsed ? 80 : 248

  const userMenu = {
    items: [
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '설정',
        onClick: () => navigate('/app/settings'),
      },
      { type: 'divider' as const },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '로그아웃',
        danger: true,
        onClick: () => void logout().then(() => navigate('/login')),
      },
    ],
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider
          className="goorm-sider"
          collapsible
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          width={248}
          collapsedWidth={80}
          trigger={null}
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
          <Logo collapsed={sidebarCollapsed} />
          {!sidebarCollapsed && <SidebarMenu />}
          {sidebarCollapsed && <CollapsedNav />}
        </Sider>
      )}

      <Layout style={{ marginLeft: siderWidth, transition: 'margin-left 0.25s ease' }}>
        <Header className="goorm-header">
          <div className="goorm-header-left">
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
          <div className="goorm-header-right">
            <Button
              type="text"
              shape="circle"
              icon={themeMode === 'light' ? <MoonOutlined /> : <SunOutlined />}
              onClick={toggleTheme}
              aria-label="테마 전환"
            />
            <Dropdown menu={userMenu} placement="bottomRight">
              <div className="goorm-header-user">
                <Avatar
                  size={36}
                  style={{ background: 'linear-gradient(135deg, #5B6CFF, #8B5CF6)' }}
                  icon={<UserOutlined />}
                  src={profile?.avatar_url ?? undefined}
                />
                {!isMobile && (
                  <Typography.Text strong style={{ fontSize: 14 }}>
                    {profile?.nickname ?? profile?.email}
                  </Typography.Text>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="goorm-main">
          <Outlet />
        </Content>
      </Layout>

      <Drawer
        title={
          <span className="goorm-sider-logo-text" style={{ fontSize: 16 }}>
            구름 TODO
          </span>
        }
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{ body: { padding: 0 } }}
        width={280}
      >
        <SidebarMenu onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
    </Layout>
  )
}
