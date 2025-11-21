import type { SupabaseClient } from "@supabase/supabase-js"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

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
  handle: string | null
  display_name: string
  bio: string | null
  links: string[]
  support_link_id: string
  balance: number
  is_active: boolean
  created_at: string
  updated_at: string
}

type Supabase = SupabaseClient<Database>

function serverSupabase(): Supabase {
  const client = getSupabaseServerClient()
  if (!client) {
    const missing = []
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL")
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY")
    
    const errorMsg = missing.length > 0
      ? `Missing Supabase environment variables: ${missing.join(", ")}. Please set them in your .env file.`
      : "Supabase is not configured. Please check your environment variables."
    
    throw new Error(errorMsg)
  }
  return client
}

export async function getUserByTelegramId(telegramId: string): Promise<User | null> {
  const { data, error } = await serverSupabase()
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .maybeSingle()

  if (error && error.code !== "PGRST116") {
    throw error
  }

  return (data ?? null) as User | null
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
  try {
    const { data: inserted, error } = await serverSupabase()
      .from("users")
      .insert({
        telegram_id: telegramId,
        username: data.username || null,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        phone_number: data.phone_number || null,
      })
      .select("*")
      .single()

    if (error) {
      console.error("Error creating user:", error)
      // Check if it's a table not found error
      if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
        throw new Error("Database tables not found. Please run the database migration script first.")
      }
      throw new Error(`Database error: ${error.message}`)
    }

    if (!inserted) {
      throw new Error("User creation returned no data")
    }

    return inserted as User
  } catch (error) {
    console.error("createUser error:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to create user in database")
  }
}

export interface TelegramProfilePayload {
  id: number
  first_name?: string
  last_name?: string
  username?: string
}

export async function upsertTelegramUser(payload: TelegramProfilePayload): Promise<User> {
  try {
    const telegramId = String(payload.id)
    const existing = await getUserByTelegramId(telegramId)

    const firstName = payload.first_name ?? existing?.first_name ?? null
    const lastName = payload.last_name ?? existing?.last_name ?? null
    const username = payload.username ?? existing?.username ?? null

    if (existing) {
      const { data, error } = await serverSupabase()
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          username,
        })
        .eq("id", existing.id)
        .select("*")
        .single()

      if (error) {
        console.error("Error updating user:", error)
        throw new Error(`Database error: ${error.message}`)
      }

      if (!data) {
        throw new Error("User update returned no data")
      }

      return data as User
    }

    return createUser(telegramId, {
      username: username || undefined,
      first_name: firstName || undefined,
      last_name: lastName || undefined,
    })
  } catch (error) {
    console.error("upsertTelegramUser error:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to create or update user in database")
  }
}

export async function getCreatorByUserId(userId: number): Promise<Creator | null> {
  const { data, error } = await serverSupabase().from("creators").select("*").eq("user_id", userId).maybeSingle()

  if (error && error.code !== "PGRST116") {
    throw error
  }

  return normalizeCreator(data as Database["public"]["Tables"]["creators"]["Row"] | null)
}

export async function getCreatorBySupportLink(linkId: string): Promise<Creator | null> {
  const { data, error } = await serverSupabase()
    .from("creators")
    .select("*")
    .eq("support_link_id", linkId)
    .maybeSingle()

  if (error && error.code !== "PGRST116") {
    throw error
  }

  return normalizeCreator(data as Database["public"]["Tables"]["creators"]["Row"] | null)
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
  const { data: inserted, error } = await serverSupabase()
    .from("creators")
    .insert({
      user_id: userId,
      channel_username: data.channel_username,
      display_name: data.display_name,
      bio: data.bio || null,
      links: data.links || [],
      support_link_id: supportLinkId,
    })
    .select("*")
    .single()

  if (error) {
    throw error
  }

  const normalized = normalizeCreator(inserted as Database["public"]["Tables"]["creators"]["Row"])
  if (!normalized) {
    throw new Error("Failed to create creator record.")
  }
  return normalized
}

function normalizeCreator(record: Database["public"]["Tables"]["creators"]["Row"] | null): Creator | null {
  if (!record) {
    return null
  }

  const linksValue = record.links
  const links = Array.isArray(linksValue) ? (linksValue as string[]) : []

  return {
    ...record,
    handle: record.handle ?? null,
    links,
  }
}
