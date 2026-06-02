import { create } from 'zustand'
import type { LocalSession } from '@/types/auth'
import type { UserProfile } from '@/types'
import * as authApi from '@/api/authApi'

interface AuthState {
  session: LocalSession | null
  profile: UserProfile | null
  loading: boolean
  initialized: boolean
  setSession: (session: LocalSession | null) => void
  setProfile: (profile: UserProfile | null) => void
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  loading: false,
  initialized: false,

  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),

  initialize: async () => {
    try {
      const session = await authApi.getSession()
      set({ session })

      if (session?.user) {
        const profile = await authApi.getProfile(session.user.id)
        set({ profile })
      }
    } finally {
      set({ initialized: true })
    }
  },

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { session } = await authApi.signIn(email, password)
      set({ session })
      if (session?.user) {
        const profile = await authApi.getProfile(session.user.id)
        set({ profile })
      }
    } finally {
      set({ loading: false })
    }
  },

  register: async (email, password, nickname) => {
    set({ loading: true })
    try {
      const { session } = await authApi.signUp(email, password, nickname)
      if (session?.user) {
        const profile = await authApi.getProfile(session.user.id)
        set({ session, profile })
      }
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    await authApi.signOut()
    set({ session: null, profile: null })
  },
}))

export function useAuthUserId(): string | undefined {
  return useAuthStore((s) => s.session?.user?.id)
}
