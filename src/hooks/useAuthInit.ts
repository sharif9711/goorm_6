import { useEffect } from 'react'
import { onAuthStateChange } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'

export function useAuthInit() {
  const initialize = useAuthStore((s) => s.initialize)
  const setSession = useAuthStore((s) => s.setSession)

  useEffect(() => {
    void initialize()
    const { data } = onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }, [initialize, setSession])
}
