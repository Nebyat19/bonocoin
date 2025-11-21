import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"

import { upsertTelegramUser } from "@/lib/auth"

interface TelegramInitUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
}

const ONE_DAY_SECONDS = 86400

function verifyTelegramInitData(initData: string, botToken: string): TelegramInitUser {
  const urlParams = new URLSearchParams(initData)
  const receivedHash = urlParams.get("hash")
  const authDate = Number(urlParams.get("auth_date") || "0")

  if (!receivedHash) {
    throw new Error("Missing hash in Telegram payload.")
  }

  if (!authDate || Date.now() / 1000 - authDate > ONE_DAY_SECONDS) {
    throw new Error("Telegram payload expired. Please try again.")
  }

  urlParams.delete("hash")

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest()
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex")

  if (computedHash !== receivedHash) {
    throw new Error("Invalid Telegram signature.")
  }

  const rawUser = urlParams.get("user")
  if (!rawUser) {
    throw new Error("Telegram user payload missing.")
  }

  const parsedUser = JSON.parse(rawUser) as TelegramInitUser

  if (!parsedUser.id) {
    throw new Error("Telegram user ID is required.")
  }

  return parsedUser
}

export async function POST(req: NextRequest) {
  try {
    const { initData } = (await req.json()) as { initData?: string }

    if (!initData) {
      return NextResponse.json({ error: "Missing Telegram initData payload." }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json({ error: "Server missing TELEGRAM_BOT_TOKEN." }, { status: 500 })
    }

    console.log("Verifying Telegram initData...")
    const telegramUser = verifyTelegramInitData(initData, botToken)
    console.log("Telegram user verified:", { id: telegramUser.id, username: telegramUser.username })

    console.log("Upserting user to Supabase...")
    const storedUser = await upsertTelegramUser(telegramUser)
    console.log("User upserted successfully:", storedUser.id)

    return NextResponse.json({ user: storedUser })
  } catch (error) {
    console.error("Telegram auth error:", error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      const errorMessage = error.message
      
      // Check for specific error types
      if (errorMessage.includes("Supabase") || errorMessage.includes("configured")) {
        return NextResponse.json(
          { error: "Database configuration error. Please check your Supabase credentials." },
          { status: 500 }
        )
      }
      
      if (errorMessage.includes("signature") || errorMessage.includes("hash")) {
        return NextResponse.json(
          { error: "Invalid Telegram authentication. Please try again." },
          { status: 401 }
        )
      }
      
      if (errorMessage.includes("expired")) {
        return NextResponse.json(
          { error: "Telegram session expired. Please refresh and try again." },
          { status: 401 }
        )
      }
      
      // Return the specific error message
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: "Unable to process Telegram login. Please check server logs for details." },
      { status: 500 }
    )
  }
}


