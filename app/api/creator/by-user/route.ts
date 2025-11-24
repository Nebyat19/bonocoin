import { NextRequest, NextResponse } from "next/server"
import { getCreatorByUserId } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const userIdParam = req.nextUrl.searchParams.get("user_id")
    if (!userIdParam) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userId = Number.parseInt(userIdParam, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const creator = await getCreatorByUserId(userId)

    if (!creator) {
      return NextResponse.json(null, { status: 200 })
    }

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
    console.error("Error fetching creator:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch creator" },
      { status: 500 }
    )
  }
}

