"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useUser } from "@/contexts/UserContext"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { useBranchSync } from "@/hooks/useBranchSync"
import { useRouter } from "next/navigation"
import { setMembershipExpired } from "@/store/slices/uiSlice"
import { KPICards } from "./components/KPICards"
import { RecentPrescriptions, DashboardPrescription } from "./components/RecentPrescriptions"
import { QuickActions } from "./components/QuickActions"
import { LowStockAlerts, LowStockProduct } from "./components/LowStockAlerts"
import { DashboardStats } from "./components/DashboardStats"
import { MembershipLock } from "@/components/membership-lock"

export function DashboardContent() {
  const { user } = useUser()
  const selectedBranchId = useAppSelector((state) => state.branch.selectedBranchId)
  const router = useRouter()

  // Sync branches to Redux
  useBranchSync(user?.pharmacy_id)

  // Get membership status from Redux
  const isMembershipExpired = useAppSelector((state) => state.ui.isMembershipExpired)

  const handleUpgrade = () => {
    router.push("/pricing")
  }

  const [loading, setLoading] = useState(true)
  const [lowStockItems, setLowStockItems] = useState<LowStockProduct[]>([])
  const [recentPrescriptions, setRecentPrescriptions] = useState<DashboardPrescription[]>([])
  const [salesAnalytics, setSalesAnalytics] = useState<{
    today_transactions: number
    transactions_change_percent: number
    this_month_earnings: number
    this_month_earnings_change_percent: number
  } | null>(null)

  const handleDataLoaded = useCallback((data: {
    lowStockItems: LowStockProduct[]
    recentPrescriptions: DashboardPrescription[]
    salesAnalytics: {
      today_transactions: number
      transactions_change_percent: number
      this_month_earnings: number
      this_month_earnings_change_percent: number
    } | null
  }) => {
    setLowStockItems(data.lowStockItems)
    setRecentPrescriptions(data.recentPrescriptions)
    setSalesAnalytics(data.salesAnalytics)
    setLoading(false)
  }, [])

  useEffect(() => {
    setLoading(true)
  }, [selectedBranchId])

  return (
    <>
      <DashboardStats selectedBranchId={selectedBranchId} onDataLoaded={handleDataLoaded} />


      {loading ? (
        <div className="p-8 flex justify-center items-center h-full">Loading dashboard...</div>
      ) : (
        <>
          <KPICards salesAnalytics={salesAnalytics} lowStockCount={lowStockItems.length} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            <div className="xl:col-span-2">
              <MembershipLock
                isLocked={isMembershipExpired}
                description="Upgrade to access prescriptions"
                actionText="Upgrade Now"
                onAction={handleUpgrade}
              >
                <RecentPrescriptions prescriptions={recentPrescriptions} />
              </MembershipLock>
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-6 sm:mt-8">
            <MembershipLock
              isLocked={isMembershipExpired}
              description="Upgrade to monitor stock levels"
              actionText="Upgrade Now"
              onAction={handleUpgrade}
            >
              <LowStockAlerts items={lowStockItems} />
            </MembershipLock>
          </div>
        </>
      )}
    </>
  )
}
