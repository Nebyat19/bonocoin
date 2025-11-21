"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard } from "lucide-react"

interface WithdrawalRequestProps {
  currentBalance: number
}

export default function WithdrawalRequest({ currentBalance }: WithdrawalRequestProps) {
  const [withdrawalData, setWithdrawalData] = useState({
    amount: "",
    bank_account: "",
    account_holder: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const availableBalance = currentBalance * 0.95

  const handleSubmit = async () => {
    if (!withdrawalData.amount || !withdrawalData.bank_account || !withdrawalData.account_holder) {
      setErrorMessage("Please fill in all required fields.")
      return
    }

    if (Number.parseFloat(withdrawalData.amount) > availableBalance) {
      setErrorMessage("Insufficient balance.")
      return
    }

    setErrorMessage(null)
    setIsLoading(true)
    try {
      // Simulate withdrawal request submission
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
      setWithdrawalData({ amount: "", bank_account: "", account_holder: "" })
    } catch (error) {
      console.error("Withdrawal error:", error)
      setErrorMessage("Withdrawal request failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <CreditCard className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Request Withdrawal</h3>
            <p className="text-xs text-muted-foreground">Available: {availableBalance.toFixed(2)} BONO</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Withdrawal Amount (BONO) *</label>
            <Input
              type="number"
              value={withdrawalData.amount}
              onChange={(e) =>
                setWithdrawalData({
                  ...withdrawalData,
                  amount: e.target.value,
                })
              }
              placeholder="Enter amount"
              className="bg-input border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Max: {availableBalance.toFixed(2)} BONO</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Account Holder Name *</label>
            <Input
              value={withdrawalData.account_holder}
              onChange={(e) =>
                setWithdrawalData({
                  ...withdrawalData,
                  account_holder: e.target.value,
                })
              }
              placeholder="Full name"
              className="bg-input border-border text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Bank Account Details *</label>
            <Textarea
              value={withdrawalData.bank_account}
              onChange={(e) =>
                setWithdrawalData({
                  ...withdrawalData,
                  bank_account: e.target.value,
                })
              }
              placeholder="Account number, bank name, etc."
              className="bg-input border-border text-foreground text-sm resize-none"
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={
          isLoading ||
          !withdrawalData.amount ||
          !withdrawalData.bank_account ||
          !withdrawalData.account_holder ||
          Number.parseFloat(withdrawalData.amount) > availableBalance
        }
        className="w-full bg-secondary hover:bg-secondary/90 h-12 text-base font-semibold text-secondary-foreground"
      >
        {isLoading ? "Processing..." : "Submit Withdrawal Request"}
      </Button>

      {errorMessage && <p className="text-sm text-primary text-center">{errorMessage}</p>}

      {submitted && (
        <Card className="bg-primary/10 border-primary/30 p-4">
          <p className="text-sm text-primary font-semibold">
            Withdrawal request submitted! Admins will review and process it soon.
          </p>
        </Card>
      )}
    </div>
  )
}
