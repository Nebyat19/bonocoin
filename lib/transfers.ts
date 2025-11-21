import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function transferCoins(fromUserId: number, toCreatorId: number, amount: number, message?: string) {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    throw new Error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
  }
  try {
    const { data: sender, error: senderError } = await supabase
      .from("users")
      .select("id, balance")
      .eq("id", fromUserId)
      .single()

    if (senderError) {
      throw senderError
    }

    if (!sender) {
      throw new Error("User not found")
    }

    if (sender.balance < amount) {
      throw new Error("Insufficient balance")
    }

    const { error: debitError } = await supabase
      .from("users")
      .update({ balance: sender.balance - amount })
      .eq("id", fromUserId)

    if (debitError) {
      throw debitError
    }

    const { data: creator, error: creatorError } = await supabase
      .from("creators")
      .select("id, balance")
      .eq("id", toCreatorId)
      .single()

    if (creatorError) {
      throw creatorError
    }

    if (!creator) {
      throw new Error("Creator not found")
    }

    const creatorBalance = creator.balance + amount * 0.95
    const { error: creditError } = await supabase.from("creators").update({ balance: creatorBalance }).eq("id", toCreatorId)

    if (creditError) {
      throw creditError
    }

    const { error: transactionError } = await supabase.from("transactions").insert({
      from_user_id: fromUserId,
      to_creator_id: toCreatorId,
      amount,
      admin_fee: amount * 0.05,
      transaction_type: "transfer",
      description: message ?? null,
      status: "completed",
    })

    if (transactionError) {
      throw transactionError
    }

    return { success: true, message: "Transfer completed" }
  } catch (error) {
    console.error("Transfer error:", error)
    throw error
  }
}

export async function addCoinsToUser(userId: number, amount: number, transactionRef: string) {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    throw new Error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
  }
  try {
    const { data: user, error: userError } = await supabase.from("users").select("balance").eq("id", userId).single()
    if (userError) {
      throw userError
    }

    const newBalance = (user?.balance ?? 0) + amount
    const { data: updated, error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", userId)
      .select("balance")
      .single()

    if (updateError) {
      throw updateError
    }

    const { error: transactionError } = await supabase.from("transactions").insert({
      from_user_id: null,
      to_creator_id: null,
      amount,
      transaction_type: "purchase",
      description: `Purchase via ${transactionRef}`,
      status: "completed",
    })

    if (transactionError) {
      throw transactionError
    }

    return updated
  } catch (error) {
    console.error("Add coins error:", error)
    throw error
  }
}

export async function getUserBalance(userId: number): Promise<number> {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    throw new Error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
  }
  const { data, error } = await supabase.from("users").select("balance").eq("id", userId).maybeSingle()
  if (error && error.code !== "PGRST116") {
    throw error
  }
  return data?.balance || 0
}

export async function getCreatorBalance(creatorId: number): Promise<number> {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    throw new Error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
  }
  const { data, error } = await supabase.from("creators").select("balance").eq("id", creatorId).maybeSingle()
  if (error && error.code !== "PGRST116") {
    throw error
  }
  return data?.balance || 0
}
