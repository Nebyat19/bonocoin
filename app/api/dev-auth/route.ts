import { NextRequest, NextResponse } from "next/server"
import { upsertTelegramUser } from "@/lib/auth"

/**
 * Development-only authentication endpoint
 * Only works when NEXT_PUBLIC_DEV_MODE is enabled
 */
export async function POST(req: NextRequest) {
  // Check if dev mode is enabled
  const isDevMode = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEV_MODE === "true"

  if (!isDevMode) {
    return NextResponse.json({ error: "Dev mode is not enabled" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { telegram_id, first_name, last_name, username } = body

    // Use provided data or defaults
    const mockTelegramUser = {
      id: telegram_id || 123456789,
      first_name: first_name || "Test",
      last_name: last_name || "User",
      username: username || "testuser",
    }

    // Create or update user in database
    const user = await upsertTelegramUser(mockTelegramUser)

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
    })
  } catch (error) {
    console.error("Dev auth error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to authenticate" },
      { status: 500 }
    )
  }
}

