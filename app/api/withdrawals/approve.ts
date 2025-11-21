import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { withdrawal_id, admin_id } = body

    if (!withdrawal_id || !admin_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update withdrawal status
    const result = await query(
      `UPDATE withdrawal_requests 
       SET status = 'approved', approved_at = NOW(), approved_by = $1
       WHERE id = $2
       RETURNING *`,
      [admin_id, withdrawal_id],
    )

    // In production, trigger actual payment to bank account
    // Example: Process via Chapa bank transfer API

    return NextResponse.json({
      status: "success",
      withdrawal: result[0],
    })
  } catch (error) {
    console.error("Withdrawal approval error:", error)
    return NextResponse.json({ error: "Withdrawal approval failed" }, { status: 500 })
  }
}
