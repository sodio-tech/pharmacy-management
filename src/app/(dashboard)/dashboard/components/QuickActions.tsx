"use client"

import { useRouter } from "next/navigation"
import { Plus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/store/hooks"
import { MembershipLock } from "@/components/membership-lock"

export function QuickActions() {
  const router = useRouter()
  const isMembershipExpired = useAppSelector((state) => state.ui.isMembershipExpired)

  const handleUpgrade = () => {
    router.push("/pricing")
  }

  return (
    <MembershipLock
      isLocked={isMembershipExpired}
      description="Upgrade to access quick actions"
      actionText="Upgrade Now"
      onAction={handleUpgrade}
    >
      <Card className="bg-white border-[#e5e7eb] h-full flex flex-col">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl font-semibold text-[#111827]">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 flex-1">
          <div className="space-y-3">
            <Button 
              onClick={() => router.push("/sales")}
              disabled={isMembershipExpired}
              className="w-full h-12 sm:h-[55px] bg-[#0f766e] hover:bg-[#0f766e]/90 text-white justify-start gap-2 text-sm sm:text-base disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              New Sale
            </Button>
            <Button 
              onClick={() => router.push("/inventory")}
              disabled={isMembershipExpired}
              className="w-full h-12 sm:h-[55px] bg-[#06b6d4] hover:bg-[#06b6d4]/90 text-white justify-start gap-2 text-sm sm:text-base disabled:opacity-50"
            >
              <Package className="w-4 h-4" />
              Add Inventory
            </Button>
          </div>
        </CardContent>
      </Card>
    </MembershipLock>
  )
}

