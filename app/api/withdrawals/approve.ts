import { type NextRequest, NextResponse } from "next/server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { withdrawal_id, admin_id } = body

    if (!withdrawal_id || !admin_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
    }
    const { data, error } = await supabase
      .from("withdrawal_requests")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: admin_id,
      })
      .eq("id", withdrawal_id)
      .select("*")
      .single()

    if (error) {
      throw error
    }

    // In production, trigger actual payment to bank account
    // Example: Process via Chapa bank transfer API

    return NextResponse.json({
      status: "success",
      withdrawal: data,
    })
  } catch (error) {
    console.error("Withdrawal approval error:", error)
    return NextResponse.json({ error: "Withdrawal approval failed" }, { status: 500 })
  }
}
