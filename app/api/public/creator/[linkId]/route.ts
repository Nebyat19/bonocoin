import { NextRequest, NextResponse } from "next/server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

interface PublicCreatorResponse {
  id: number
  user_id: number
  display_name: string | null
  channel_username: string | null
  handle: string | null
  bio: string | null
  links: string[]
  balance: number
  support_link_id: string
  is_active: boolean
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await context.params
    if (!linkId) {
      return NextResponse.json({ error: "Support link ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { data, error } = await supabase
      .from("creators")
      .select("id, user_id, display_name, channel_username, handle, bio, links, balance, support_link_id, is_active")
      .eq("support_link_id", linkId)
      .maybeSingle()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    if (!data) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 })
    }

    const response: PublicCreatorResponse = {
      id: Number(data.id),
      user_id: Number(data.user_id),
      display_name: data.display_name,
      channel_username: data.channel_username,
      handle: data.handle,
      bio: data.bio,
      links: Array.isArray(data.links) ? data.links.map((link: unknown) => String(link ?? "")) : [],
      balance: Number(data.balance ?? 0),
      support_link_id: data.support_link_id,
      is_active: data.is_active ?? true,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error loading public creator profile:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load creator" },
      { status: 500 }
    )
  }
}


