import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database"

let supabaseServerClient: SupabaseClient<Database> | null = null

export function getSupabaseServerClient(): SupabaseClient<Database> | null {
  if (supabaseServerClient) {
    return supabaseServerClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn("Missing Supabase server environment variables. Supabase features will be disabled.")
    return null
  }

  supabaseServerClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "X-Client-Info": "bonocoin-server",
      },
    },
  })

  return supabaseServerClient
}


