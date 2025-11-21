import { type NextRequest, NextResponse } from "next/server"
import { verifyPayment } from "@/lib/payments"
import { addCoinsToUser } from "@/lib/transfers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference } = body

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    // Verify payment with payment provider
    const paymentData = await verifyPayment(reference)

    if (!paymentData || paymentData.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    const { metadata } = paymentData

    // Add coins to user
    await addCoinsToUser(metadata.user_id, metadata.coins, reference)

    return NextResponse.json({
      status: "success",
      message: "Payment processed and coins added",
    })
  } catch (error) {
    console.error("Payment callback error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
