"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Users, Sparkles, User, Users as UsersIcon, CreditCard, FileText, History } from "lucide-react"
import UnifiedHeader from "./header"
import UserBalance from "@/components/user/balance-card"
import BuyCoins from "@/components/user/buy-coins"
import SendCoins from "@/components/user/send-coins"
import UserTransactionHistory from "@/components/user/transaction-history"
import CreatorBalance from "@/components/creator/balance-card"
import CreatorProfile from "@/components/creator/profile"
import SupportersList from "@/components/creator/supporters-list"
import WithdrawalRequest from "@/components/creator/withdrawal-request"
import WithdrawalRequestsList from "@/components/creator/withdrawal-requests-list"
import CreatorTransactions from "@/components/creator/transactions"
import type { StoredCreator, StoredUser } from "@/types/models"

interface UnifiedDashboardProps {
  user: StoredUser
  creator?: StoredCreator | null
}

export default function UnifiedDashboard({ user, creator }: UnifiedDashboardProps) {
  const [activeTab, setActiveTab] = useState("support")
  const [userBalance, setUserBalance] = useState(Number(user.balance ?? 0))
  const [creatorBalance, setCreatorBalance] = useState(Number(creator?.balance ?? 0))
  const [currentCreator, setCurrentCreator] = useState<StoredCreator | null>(creator ?? null)
  const [transactionRefreshTrigger, setTransactionRefreshTrigger] = useState(0)

  // Update currentCreator when creator prop changes
  useEffect(() => {
    setCurrentCreator(creator ?? null)
    if (creator) {
      setCreatorBalance(Number(creator.balance ?? 0))
      // Switch to creator tab if creator was just created
      setActiveTab("creator")
    }
  }, [creator])

  return (
    <div className="min-h-screen bg-background pb-20">
      <UnifiedHeader user={user} creator={creator} />
      <main className="max-w-md mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex w-full h-12 bg-muted/30 mb-6 rounded-lg p-1 gap-1 border border-border/30">
            <TabsTrigger 
              value="support" 
              className="flex-1 flex items-center justify-center gap-2 h-full rounded-md font-semibold text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:bg-transparent"
            >
              <Coins className="w-4 h-4" />
              <span>Support</span>
            </TabsTrigger>
            {currentCreator && (
              <TabsTrigger 
                value="creator" 
                className="flex-1 flex items-center justify-center gap-2 h-full rounded-md font-semibold text-sm transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:bg-transparent"
              >
                <Users className="w-4 h-4" />
                <span>Creator</span>
              </TabsTrigger>
            )}
            {!currentCreator && (
              <TabsTrigger 
                value="become-creator" 
                className="flex-1 flex items-center justify-center gap-2 h-full rounded-md font-semibold text-sm transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:bg-transparent"
              >
                <Sparkles className="w-4 h-4" />
                <span>Become Creator</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Support Tab - User Features */}
          <TabsContent value="support" className="space-y-6">
            <UserBalance balance={userBalance} />
            <Tabs defaultValue="balance" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted mb-4">
                <TabsTrigger value="balance">Balance</TabsTrigger>
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="send">Send</TabsTrigger>
              </TabsList>
              <TabsContent value="balance" className="space-y-6">
                <UserTransactionHistory userId={user.id!} refreshTrigger={transactionRefreshTrigger} />
              </TabsContent>
              <TabsContent value="buy" className="space-y-6">
                <BuyCoins
                  onSuccess={(amount) => {
                    setUserBalance((prev) => prev + amount)
                    setTransactionRefreshTrigger((prev) => prev + 1)
                  }}
                />
              </TabsContent>
              <TabsContent value="send" className="space-y-6">
                <SendCoins
                  currentBalance={userBalance}
                  onSuccess={(amount) => {
                    setUserBalance((prev) => prev - amount)
                    setTransactionRefreshTrigger((prev) => prev + 1)
                  }}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Creator Tab */}
          {currentCreator && (
            <TabsContent value="creator" className="space-y-6">
              <CreatorBalance balance={creatorBalance} />
              <Tabs defaultValue="profile" className="w-full">
                <div className="overflow-x-auto mb-4 -mx-4 px-4 scrollbar-hide">
                  <TabsList className="inline-flex bg-muted p-1 h-auto gap-1">
                    <TabsTrigger 
                      value="profile" 
                      className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 min-w-[70px] text-[10px] leading-tight whitespace-nowrap"
                    >
                      <User className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-[60px]">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="supporters" 
                      className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 min-w-[70px] text-[10px] leading-tight whitespace-nowrap"
                    >
                      <UsersIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-[60px]">Supporters</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="withdraw" 
                      className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 min-w-[70px] text-[10px] leading-tight whitespace-nowrap"
                    >
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-[60px]">Withdraw</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="requests" 
                      className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 min-w-[70px] text-[10px] leading-tight whitespace-nowrap"
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-[60px]">Requests</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="transactions" 
                      className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 min-w-[70px] text-[10px] leading-tight whitespace-nowrap"
                    >
                      <History className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-[60px]">Transactions</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="profile" className="space-y-6">
                  <CreatorProfile
                    creator={currentCreator}
                    onProfileUpdate={(updated) => {
                      setCurrentCreator(updated)
                      setCreatorBalance(Number(updated.balance ?? creatorBalance))
                    }}
                  />
                </TabsContent>
                <TabsContent value="supporters" className="space-y-6">
                  <SupportersList creatorId={currentCreator.id!} />
                </TabsContent>
                <TabsContent value="withdraw" className="space-y-6">
                  <WithdrawalRequest currentBalance={creatorBalance} />
                </TabsContent>
                <TabsContent value="requests" className="space-y-6">
                  <WithdrawalRequestsList creatorId={currentCreator.id!} />
                </TabsContent>
                <TabsContent value="transactions" className="space-y-6">
                  <CreatorTransactions creatorId={currentCreator.id!} />
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}

          {/* Become Creator Tab */}
          {!currentCreator && (
            <TabsContent value="become-creator" className="space-y-6">
              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-lg p-8 text-center">
                <div className="flex justify-start mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("support")}
                    className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                  >
                    ← Back 
                  </button>
                </div>
                <div className="text-4xl sm:text-6xl font-bold mb-4 neon-glow animate-bounce-slow">₿</div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Become a Creator</h2>
                <p className="text-muted-foreground mb-6">
                  Set up your creator profile to start receiving support from your audience
                </p>
                <button
                  onClick={() => {
                    window.location.href = "/creator"
                  }}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 text-base font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Set Up Creator Profile
                </button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}

