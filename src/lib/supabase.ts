import { createClient } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '@/lib/config'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase가 설정되지 않았습니다. .env 파일을 확인하세요.')
  }
  return supabase
}
