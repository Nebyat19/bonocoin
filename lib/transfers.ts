import { query, queryOne } from "./db"

export async function transferCoins(fromUserId: number, toCreatorId: number, amount: number, message?: string) {
  try {
    // Begin transaction
    const result = await query(
      `BEGIN;
       UPDATE users SET balance = balance - $1 WHERE id = $2;
       UPDATE creators SET balance = balance + $3 WHERE id = $4;
       INSERT INTO transactions (from_user_id, to_creator_id, amount, admin_fee, transaction_type, description, status)
       VALUES ($2, $4, $5, $6, 'transfer', $7, 'completed');
       COMMIT;`,
      [amount, fromUserId, amount * 0.95, toCreatorId, amount, amount * 0.05, message],
    )

    return { success: true, message: "Transfer completed" }
  } catch (error) {
    console.error("Transfer error:", error)
    throw error
  }
}

export async function addCoinsToUser(userId: number, amount: number, transactionRef: string) {
  try {
    const result = await query(`UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance`, [
      amount,
      userId,
    ])

    // Record transaction
    await query(
      `INSERT INTO transactions (from_user_id, to_creator_id, amount, transaction_type, description, status)
       VALUES (NULL, NULL, $1, 'purchase', $2, 'completed')`,
      [amount, `Purchase via ${transactionRef}`],
    )

    return result[0]
  } catch (error) {
    console.error("Add coins error:", error)
    throw error
  }
}

export async function getUserBalance(userId: number): Promise<number> {
  const result = await queryOne<{ balance: number }>("SELECT balance FROM users WHERE id = $1", [userId])
  return result?.balance || 0
}

export async function getCreatorBalance(creatorId: number): Promise<number> {
  const result = await queryOne<{ balance: number }>("SELECT balance FROM creators WHERE id = $1", [creatorId])
  return result?.balance || 0
}
