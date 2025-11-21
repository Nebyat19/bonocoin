import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { creator_id, display_name, bio, channel_username, links } = body

    if (!creator_id) {
      return NextResponse.json({ error: "Creator ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const updateData: any = {}
    if (display_name !== undefined) updateData.display_name = display_name
    if (bio !== undefined) updateData.bio = bio
    if (channel_username !== undefined) updateData.channel_username = channel_username
    if (links !== undefined) updateData.links = links
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("creators")
      .update(updateData)
      .eq("id", creator_id)
      .select("*")
      .single()

    if (error) {
      throw error
    }

    const creator = data as any
    return NextResponse.json({
      id: creator.id,
      user_id: creator.user_id,
      handle: creator.handle,
      channel_username: creator.channel_username,
      display_name: creator.display_name,
      bio: creator.bio,
      links: Array.isArray(creator.links) ? creator.links : [],
      support_link_id: creator.support_link_id,
      balance: Number(creator.balance),
    })
  } catch (error) {
    console.error("Error updating creator:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update creator" },
      { status: 500 }
    )
  }
}

