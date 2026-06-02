/** Supabase .env가 설정되었는지 확인 */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  if (!url || !key) return false
  if (url.includes('your-project') || key.includes('your-anon-key')) return false
  return true
}

export type DataMode = 'supabase' | 'local'

export function getDataMode(): DataMode {
  return isSupabaseConfigured() ? 'supabase' : 'local'
}
