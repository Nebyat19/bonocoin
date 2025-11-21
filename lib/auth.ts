import { query, queryOne } from "./db"

export interface User {
  id: number
  telegram_id: string
  username: string | null
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  balance: number
  created_at: string
  updated_at: string
}

export interface Creator {
  id: number
  user_id: number
  channel_username: string
  handle?: string
  display_name: string
  bio: string | null
  links: string[]
  support_link_id: string
  balance: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getUserByTelegramId(telegramId: string): Promise<User | null> {
  return queryOne<User>("SELECT * FROM users WHERE telegram_id = $1", [telegramId])
}

export async function createUser(
  telegramId: string,
  data: {
    username?: string
    first_name?: string
    last_name?: string
    phone_number?: string
  },
): Promise<User> {
  const result = await query<User>(
    `INSERT INTO users (telegram_id, username, first_name, last_name, phone_number)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [telegramId, data.username || null, data.first_name || null, data.last_name || null, data.phone_number || null],
  )
  return result[0]
}

export async function getCreatorByUserId(userId: number): Promise<Creator | null> {
  return queryOne<Creator>("SELECT * FROM creators WHERE user_id = $1", [userId])
}

export async function getCreatorBySupportLink(linkId: string): Promise<Creator | null> {
  return queryOne<Creator>("SELECT * FROM creators WHERE support_link_id = $1", [linkId])
}

export async function createCreator(
  userId: number,
  data: {
    channel_username: string
    display_name: string
    bio?: string
    links?: string[]
  },
  supportLinkId: string,
): Promise<Creator> {
  const result = await query<Creator>(
    `INSERT INTO creators (user_id, channel_username, display_name, bio, links, support_link_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      data.channel_username,
      data.display_name,
      data.bio || null,
      JSON.stringify(data.links || []),
      supportLinkId,
    ],
  )
  return result[0]
}
