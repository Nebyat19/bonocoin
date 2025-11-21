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

    const telegramUser = verifyTelegramInitData(initData, botToken)
    const storedUser = await upsertTelegramUser(telegramUser)

    return NextResponse.json({ user: storedUser })
  } catch (error) {
    console.error("Telegram auth error:", error)
    const message = error instanceof Error ? error.message : "Unable to process Telegram login."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}


