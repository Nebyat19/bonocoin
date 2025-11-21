import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { creator_id, amount, bank_account, account_holder } = body

    if (!creator_id || !amount || !bank_account) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create withdrawal request
    const result = await query(
      `INSERT INTO withdrawal_requests (creator_id, amount, bank_account, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [creator_id, amount, JSON.stringify({ account_holder, ...bank_account })],
    )

    return NextResponse.json({
      status: "success",
      withdrawal: result[0],
    })
  } catch (error) {
    console.error("Withdrawal request error:", error)
    return NextResponse.json({ error: "Withdrawal request failed" }, { status: 500 })
  }
}
