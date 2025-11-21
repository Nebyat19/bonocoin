import { NextRequest, NextResponse } from "next/server"
import { getCreatorBySupportLink } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const identifier = req.nextUrl.searchParams.get("identifier")
    if (!identifier) {
      return NextResponse.json({ error: "Identifier is required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const input = identifier.trim()

    // Try by support link ID first
    if (input.includes("/support/") || input.length > 20) {
      const parts = input.split("/")
      const linkId = parts.filter(Boolean).pop() || input
      const creator = await getCreatorBySupportLink(linkId)
      if (creator) {
        return NextResponse.json({
          id: creator.id,
          handle: creator.handle,
          display_name: creator.display_name,
          channel_username: creator.channel_username,
          support_link_id: creator.support_link_id,
        })
      }
    }

    // Try by handle/username
    const handle = input.startsWith("@") ? input.slice(1).toLowerCase() : input.toLowerCase()
    const { data: creatorData, error } = await supabase
      .from("creators")
      .select("*")
      .eq("handle", handle)
      .maybeSingle()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    if (creatorData) {
      const creator = creatorData as any
      return NextResponse.json({
        id: creator.id,
        handle: creator.handle,
        display_name: creator.display_name,
        channel_username: creator.channel_username,
        support_link_id: creator.support_link_id,
      })
    }

    return NextResponse.json({ error: "Creator not found" }, { status: 404 })
  } catch (error) {
    console.error("Error looking up creator:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to lookup creator" },
      { status: 500 }
    )
  }
}

