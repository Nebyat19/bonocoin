"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserBalance from "./balance-card"
import BuyCoins from "./buy-coins"
import SendCoins from "./send-coins"
import UserTransactionHistory from "./transaction-history"
import UserHeader from "./header"

interface UserDashboardProps {
  user: any
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("balance")
  const [balance, setBalance] = useState(user.balance || 0)

  return (
    <div className="min-h-screen bg-background pb-20">
      <UserHeader user={user} />
      <main className="max-w-md mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted mb-6">
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="send">Send</TabsTrigger>
          </TabsList>

          <TabsContent value="balance" className="space-y-6">
            <UserBalance balance={balance} />
            <UserTransactionHistory />
          </TabsContent>

          <TabsContent value="buy" className="space-y-6">
            <BuyCoins onSuccess={(amount) => setBalance(balance + amount)} />
          </TabsContent>

          <TabsContent value="send" className="space-y-6">
            <SendCoins currentBalance={balance} onSuccess={(amount) => setBalance(balance - amount)} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
