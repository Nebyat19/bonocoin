import { NextRequest, NextResponse } from "next/server"
import { getUserByTelegramId, getCreatorByUserId } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const telegramId = req.headers.get("x-telegram-id") || req.nextUrl.searchParams.get("telegram_id")

    if (!telegramId) {
      return NextResponse.json({ error: "Telegram ID is required" }, { status: 400 })
    }

    const user = await getUserByTelegramId(telegramId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Ensure user.id is a number
    const userId = typeof user.id === "string" ? Number.parseInt(user.id, 10) : user.id
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 500 })
    }

    // Try to get creator, but with a short timeout
    // If it takes too long, return null and frontend will load it separately
    let creator: Awaited<ReturnType<typeof getCreatorByUserId>> = null
    try {
      // Use Promise.race with a timeout to prevent blocking
      const creatorPromise = getCreatorByUserId(userId)
      const timeoutPromise = new Promise<null>((resolve) => 
        setTimeout(() => resolve(null), 800) // 800ms timeout - fast enough
      )
      
      const result = await Promise.race([creatorPromise, timeoutPromise])
      creator = result
    } catch (error) {
      // If error, just continue without creator - frontend will load it
      console.error("Error fetching creator (non-blocking):", error)
    }

    return NextResponse.json({
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        display_name: user.first_name || user.username || "Bonower",
        balance: Number(user.balance),
      },
      creator: creator
        ? {
            id: creator.id,
            user_id: creator.user_id,
            handle: creator.handle,
            channel_username: creator.channel_username,
            display_name: creator.display_name,
            bio: creator.bio,
            links: Array.isArray(creator.links) ? creator.links : [],
            support_link_id: creator.support_link_id,
            balance: Number(creator.balance),
          }
        : null,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch user" },
      { status: 500 }
    )
  }
}

