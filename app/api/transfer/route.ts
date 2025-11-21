import { NextRequest, NextResponse } from "next/server"
import { transferCoins } from "@/lib/transfers"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { from_user_id, to_creator_id, amount, message, supporter_name } = body

    if (!from_user_id || !to_creator_id || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const transferAmount = Number.parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Perform the transfer
    await transferCoins(from_user_id, to_creator_id, transferAmount, message)

    // Update or create supporter record
    const supabase = getSupabaseServerClient()
    if (supabase) {
      // Check if supporter record exists
      const { data: existing } = await supabase
        .from("supporters")
        .select("*")
        .eq("user_id", from_user_id)
        .eq("creator_id", to_creator_id)
        .maybeSingle()

      if (existing) {
        // Update existing supporter
        const existingData = existing as any
        await supabase
          .from("supporters")
          .update({
            total_sent: Number(existingData.total_sent) + transferAmount,
            supporter_name: supporter_name || existingData.supporter_name || null,
          } as any)
          .eq("id", existingData.id)
      } else {
        // Create new supporter record
        await supabase.from("supporters").insert({
          user_id: from_user_id,
          creator_id: to_creator_id,
          total_sent: transferAmount,
          supporter_name: supporter_name || null,
        })
      }
    }

    return NextResponse.json({ success: true, message: "Transfer completed successfully" })
  } catch (error) {
    console.error("Transfer error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Transfer failed",
      },
      { status: 500 }
    )
  }
}

