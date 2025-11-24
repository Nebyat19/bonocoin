import { type NextRequest, NextResponse } from "next/server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { creator_id, amount, bank_account, account_holder } = body

    console.log("Withdrawal request received:", { creator_id, amount, has_bank_account: !!bank_account, has_account_holder: !!account_holder })

    if (!creator_id || !amount || !bank_account) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          received: { creator_id: !!creator_id, amount: !!amount, bank_account: !!bank_account }
        }, 
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
    }
    // Format bank_account as JSON object
    // bank_account is a string (the textarea value), account_holder is separate
    const bankAccountData = {
      account_holder: account_holder || null,
      details: typeof bank_account === "string" ? bank_account : JSON.stringify(bank_account),
    }

    const creatorIdNum = typeof creator_id === "string" ? Number.parseInt(creator_id, 10) : creator_id
    if (isNaN(creatorIdNum)) {
      return NextResponse.json({ error: "Invalid creator ID" }, { status: 400 })
    }

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("withdrawal_requests")
      .insert({
        creator_id: creatorIdNum,
        amount: amountNum,
        bank_account: bankAccountData,
        status: "pending",
      } as any)
      .select("*")
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw new Error(`Database error: ${error.message || "Failed to insert withdrawal request"}`)
    }

    return NextResponse.json({
      status: "success",
      withdrawal: data,
    })
  } catch (error) {
    console.error("Withdrawal request error:", error)
    const errorMessage = error instanceof Error ? error.message : "Withdrawal request failed"
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    )
  }
}

