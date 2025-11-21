import { type NextRequest, NextResponse } from "next/server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { creator_id, amount, bank_account, account_holder } = body

    if (!creator_id || !amount || !bank_account) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
    }
    const { data, error } = await supabase
      .from("withdrawal_requests")
      .insert({
        creator_id,
        amount,
        bank_account: {
          account_holder,
          ...bank_account,
        },
        status: "pending",
      })
      .select("*")
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: "success",
      withdrawal: data,
    })
  } catch (error) {
    console.error("Withdrawal request error:", error)
    return NextResponse.json({ error: "Withdrawal request failed" }, { status: 500 })
  }
}
