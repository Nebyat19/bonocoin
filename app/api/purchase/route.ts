import { NextRequest, NextResponse } from "next/server"
import { addCoinsToUser } from "@/lib/transfers"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, amount, transaction_ref } = body

    if (!user_id || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const coinAmount = Number.parseFloat(amount)
    if (isNaN(coinAmount) || coinAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Add coins to user balance
    const result = await addCoinsToUser(user_id, coinAmount, transaction_ref || `purchase_${Date.now()}`)

    return NextResponse.json({
      success: true,
      balance: result.balance,
      message: "Coins added successfully",
    })
  } catch (error) {
    console.error("Purchase error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Purchase failed",
      },
      { status: 500 }
    )
  }
}

