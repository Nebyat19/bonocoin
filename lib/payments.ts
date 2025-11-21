"use server"

export interface PaymentConfig {
  provider: "chapa" | "mock"
  apiKey?: string
}

export async function initiatePayment(
  userId: string,
  amount: number,
  coins: number,
  provider: "chapa" | "mock" = "mock",
) {
  if (provider === "chapa") {
    return initiateChapaPayment(userId, amount, coins)
  }
  return initiateMockPayment(userId)
}

async function initiateChapaPayment(userId: string, amount: number, coins: number) {
  const chapaApiKey = process.env.CHAPA_API_KEY

  if (!chapaApiKey) {
    console.error("Chapa API keys not configured")
    return null
  }

  try {
    const reference = `bono_${userId}_${Date.now()}`

    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chapaApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "ETB",
        email: `user_${userId}@bonocoin.app`,
        first_name: "Supporter",
        last_name: "User",
        phone_number: "+251900000000",
        tx_ref: reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/user?status=success&tx_ref=${reference}`,
        metadata: {
          user_id: userId,
          coins,
          type: "coin_purchase",
        },
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Chapa payment error:", error)
    throw error
  }
}

async function initiateMockPayment(userId: string) {
  // Mock payment for testing
  return {
    status: "success",
    data: {
      checkout_url: `${process.env.NEXT_PUBLIC_APP_URL}/user?status=success`,
    },
    reference: `mock_${userId}_${Date.now()}`,
  }
}

export async function verifyPayment(reference: string) {
  const chapaApiKey = process.env.CHAPA_API_KEY

  if (!chapaApiKey) {
    console.error("Chapa API key not configured")
    return null
  }

  try {
    const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${chapaApiKey}`,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Payment verification error:", error)
    throw error
  }
}
