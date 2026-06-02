import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, App as AntApp, theme } from 'antd'
import koKR from 'antd/locale/ko_KR'
import { router } from '@/routes'
import { useSettingStore } from '@/store/settingStore'
import { useAuthInit } from '@/hooks/useAuthInit'

function AppContent() {
  useAuthInit()
  const themeMode = useSettingStore((s) => s.theme)

  return (
    <ConfigProvider
      locale={koKR}
      theme={{
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
        },
      }}
    >
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  )
}

export default function App() {
  return <AppContent />
}
