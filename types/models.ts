export interface StoredUser {
  id?: string | number
  telegram_id?: string
  first_name?: string | null
  last_name?: string | null
  username?: string | null
  display_name?: string | null
  balance?: number
  [key: string]: unknown
}

export interface StoredCreator {
  id?: string | number
  user_id?: string | number
  display_name?: string | null
  handle?: string | null
  channel_username?: string | null
  bio?: string | null
  links?: string[]
  support_link_id?: string
  balance?: number
  type?: string
  [key: string]: unknown
}

export interface WithdrawalRequestRecord {
  id: string
  amount: number
  status: "pending" | "approved" | "rejected"
  requested_at: string
  approved_at?: string
  account_holder?: string
}

export interface CreatorTransactionRecord {
  id: string
  type: "received" | "withdrawal"
  supporter_name?: string
  amount: number
  date: string
}

