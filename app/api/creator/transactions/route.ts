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

    // Get transactions for this creator
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        from_user:users!transactions_from_user_id_fkey(id, username, first_name)
      `
      )
      .eq("to_creator_id", creatorId)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      throw error
    }

    // Also get withdrawal transactions
    const { data: withdrawals, error: withdrawalError } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("creator_id", creatorId)
      .order("requested_at", { ascending: false })

    if (withdrawalError) {
      console.error("Error fetching withdrawals:", withdrawalError)
    }

    // Format transactions
    const formatted = (transactions || []).map((tx: any) => ({
      id: String(tx.id),
      type: "received" as const,
      supporter_name: (tx.from_user as any)?.first_name || (tx.from_user as any)?.username || "Anonymous",
      amount: Number(tx.amount),
      date: new Date(tx.created_at).toLocaleString(),
    }))

    // Add withdrawal transactions
    const withdrawalTransactions = (withdrawals || [])
      .filter((w: any) => w.status === "approved")
      .map((w: any) => ({
        id: `withdrawal-${w.id}`,
        type: "withdrawal" as const,
        amount: Number(w.amount),
        date: new Date(w.approved_at || w.requested_at).toLocaleString(),
      }))

    return NextResponse.json([...formatted, ...withdrawalTransactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }))
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

