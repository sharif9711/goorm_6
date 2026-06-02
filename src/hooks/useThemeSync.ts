import { useEffect } from 'react'
import { useSettingStore } from '@/store/settingStore'

export function useThemeSync() {
  const theme = useSettingStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
}
