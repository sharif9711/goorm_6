import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import koKR from 'antd/locale/ko_KR'
import { router } from '@/routes'
import { useSettingStore } from '@/store/settingStore'
import { useAuthInit } from '@/hooks/useAuthInit'
import { useThemeSync } from '@/hooks/useThemeSync'
import { getAppTheme } from '@/styles/theme'

function AppContent() {
  useAuthInit()
  useThemeSync()
  const themeMode = useSettingStore((s) => s.theme)

  return (
    <ConfigProvider locale={koKR} theme={getAppTheme(themeMode)}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  )
}

export default function App() {
  return <AppContent />
}
