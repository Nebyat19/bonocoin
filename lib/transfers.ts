import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function transferCoins(fromUserId: number, toCreatorId: number, amount: number, message?: string) {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    throw new Error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
  }
  try {
    // Get user balance
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

    // Check if user has a creator account (for unified balance)
    const { data: userCreator } = await supabase
      .from("creators")
      .select("id, balance")
      .eq("user_id", fromUserId)
      .maybeSingle()

    const userBalance = Number(sender.balance ?? 0)
    const senderCreatorBalance = userCreator ? Number(userCreator.balance ?? 0) : 0
    const totalBalance = userBalance + senderCreatorBalance

    if (totalBalance < amount) {
      throw new Error("Insufficient balance")
    }

    // Deduct from user balance first, then creator balance if needed
    let remainingAmount = amount
    let newUserBalance = userBalance
    let newSenderCreatorBalance = senderCreatorBalance

    if (userBalance >= remainingAmount) {
      // All from user balance
      newUserBalance = userBalance - remainingAmount
      remainingAmount = 0
    } else {
      // Use all user balance, then creator balance
      remainingAmount = remainingAmount - userBalance
      newUserBalance = 0
      newSenderCreatorBalance = senderCreatorBalance - remainingAmount
    }

    // Update user balance
    const { error: debitError } = await supabase
      .from("users")
      .update({ balance: newUserBalance })
      .eq("id", fromUserId)

    if (debitError) {
      throw debitError
    }

    // Update sender's creator balance if needed
    if (userCreator && newSenderCreatorBalance !== senderCreatorBalance) {
      const { error: creatorDebitError } = await supabase
        .from("creators")
        .update({ balance: newSenderCreatorBalance })
        .eq("id", userCreator.id)

      if (creatorDebitError) {
        throw creatorDebitError
      }
    }

    // Get recipient creator
    const { data: recipientCreator, error: creatorError } = await supabase
      .from("creators")
      .select("id, balance")
      .eq("id", toCreatorId)
      .single()

    if (creatorError) {
      throw creatorError
    }

    if (!recipientCreator) {
      throw new Error("Creator not found")
    }

    const recipientCreatorBalance = recipientCreator.balance + amount * 0.95
    const { error: creditError } = await supabase.from("creators").update({ balance: recipientCreatorBalance }).eq("id", toCreatorId)

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

    // Store purchase transaction with user_id for tracking
    // We'll use from_user_id to store the purchasing user (even though it's not a transfer)
    const { error: transactionError } = await supabase.from("transactions").insert({
      from_user_id: userId, // Store user_id here for purchase tracking
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
