export interface LocalUser {
  id: string
  email: string
  user_metadata?: {
    nickname?: string
  }
}

export interface LocalSession {
  user: LocalUser
  access_token: string
}
