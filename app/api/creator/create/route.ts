import { NextRequest, NextResponse } from "next/server"
import { createCreator, getCreatorByUserId } from "@/lib/auth"
import { generateSupportLinkId } from "@/lib/utils/crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, handle, channel_username, display_name, bio, links } = body

    if (!user_id || !handle || !channel_username || !display_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already has a creator profile
    const existing = await getCreatorByUserId(user_id)
    if (existing) {
      return NextResponse.json({ error: "User already has a creator profile" }, { status: 400 })
    }

    // Check if handle is already taken
    const { getSupabaseServerClient } = await import("@/lib/supabase/server")
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data: existingHandle } = await supabase
        .from("creators")
        .select("id")
        .eq("handle", handle.toLowerCase())
        .maybeSingle()

      if (existingHandle) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
      }
    }

    const supportLinkId = generateSupportLinkId()
    const creator = await createCreator(
      user_id,
      {
        channel_username,
        display_name,
        bio: bio || undefined,
        links: links || [],
      },
      supportLinkId,
      handle.toLowerCase()
    )

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
    console.error("Error creating creator:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create creator" },
      { status: 500 }
    )
  }
}

