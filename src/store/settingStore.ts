import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeMode } from '@/types'

interface SettingState {
  theme: ThemeMode
  sidebarCollapsed: boolean
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarCollapsed: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    { name: 'goorm-settings' },
  ),
)
