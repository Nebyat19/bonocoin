import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const creatorIdParam = req.nextUrl.searchParams.get("creator_id")
    if (!creatorIdParam) {
      return NextResponse.json({ error: "Creator ID is required" }, { status: 400 })
    }

    const creatorId = Number.parseInt(creatorIdParam, 10)
    if (isNaN(creatorId)) {
      return NextResponse.json({ error: "Invalid creator ID" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { data: withdrawals, error } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("creator_id", creatorId)
      .order("requested_at", { ascending: false })

    if (error) {
      throw error
    }

    const formatted = (withdrawals || []).map((w: any) => ({
      id: String(w.id),
      amount: Number(w.amount),
      status: w.status,
      requested_at: w.requested_at,
      approved_at: w.approved_at,
      bank_account: w.bank_account,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("Error fetching withdrawals:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch withdrawals" },
      { status: 500 }
    )
  }
}

