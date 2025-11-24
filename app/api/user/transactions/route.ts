import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("user_id")
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userIdNum = Number.parseInt(userId, 10)
    if (isNaN(userIdNum)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Get transactions where user sent coins (outgoing transfers)
    const { data: sentTransactions, error: sentError } = await supabase
      .from("transactions")
      .select(
        `
        *,
        to_creator:creators!transactions_to_creator_id_fkey(id, display_name, handle)
      `
      )
      .eq("from_user_id", userIdNum)
      .eq("transaction_type", "transfer")
      .order("created_at", { ascending: false })
      .limit(50)

    if (sentError) {
      console.error("Error fetching sent transactions:", sentError)
    }

    // Get purchase transactions (where from_user_id is the user and transaction_type is "purchase")
    const { data: purchaseTransactions, error: purchaseError } = await supabase
      .from("transactions")
      .select("*")
      .eq("from_user_id", userIdNum)
      .eq("transaction_type", "purchase")
      .order("created_at", { ascending: false })
      .limit(50)

    if (purchaseError) {
      console.error("Error fetching purchase transactions:", purchaseError)
    }

    // Format sent transactions (transfers to creators)
    const sentFormatted = (sentTransactions || [])
      .filter((tx: any) => tx.transaction_type === "transfer") // Only show actual transfers
      .map((tx: any) => ({
        id: String(tx.id),
        type: "send" as const,
        creator: tx.to_creator?.display_name || tx.to_creator?.handle || "Creator",
        amount: Number(tx.amount),
        date: new Date(tx.created_at).toLocaleString(),
        timestamp: new Date(tx.created_at).getTime(),
      }))

    // Format purchase transactions
    const purchaseFormatted = (purchaseTransactions || []).map((tx: any) => ({
      id: String(tx.id),
      type: "buy" as const,
      description: `Purchased ${Number(tx.amount)} BONO`,
      amount: Number(tx.amount),
      date: new Date(tx.created_at).toLocaleString(),
      timestamp: new Date(tx.created_at).getTime(),
    }))

    // Combine and sort
    const allTransactions = [...sentFormatted, ...purchaseFormatted].sort(
      (a, b) => b.timestamp - a.timestamp
    )

    return NextResponse.json(allTransactions)
  } catch (error) {
    console.error("Error fetching user transactions:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

