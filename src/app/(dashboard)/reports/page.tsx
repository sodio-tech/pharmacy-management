"use client"

import { Suspense } from "react"
import { ReportsStats } from "./reports-stats"
import { SalesTrendChart } from "./sales-trend-chart"
import { TopSellingProducts } from "./top-selling-products"
// import { ReportCategories } from "./report-categories"
// import { RecentReportsTable } from "./recent-reports-table"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"
import { MembershipLock } from "@/components/membership-lock"
import { useAppSelector } from "@/store/hooks"
import { useUser } from "@/contexts/UserContext"
import { useBranchSync } from "@/hooks/useBranchSync"
import { useRouter } from "next/navigation"
import { LoadingFallback } from "@/components/loading-fallback"

function ReportsContent() {
  const { user } = useUser()
  const selectedBranchId = useAppSelector((state) => state.branch.selectedBranchId)
  const isMembershipExpired = useAppSelector((state) => state.ui.isMembershipExpired)
  const router = useRouter()
  
  // Sync branches to Redux
  useBranchSync(user?.pharmacy_id)

  const handleUpgrade = () => {
    router.push("/pricing")
  }

  return (
    <div className="bg-[#f9fafb]">
      <MembershipLock
        isLocked={isMembershipExpired}
        description="Upgrade to view reports statistics"
        actionText="Upgrade Now"
        onAction={handleUpgrade}
      >
        <ReportsStats branchId={selectedBranchId} />
      </MembershipLock>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <MembershipLock
          isLocked={isMembershipExpired}
          description="Upgrade to view sales trends"
          actionText="Upgrade Now"
          onAction={handleUpgrade}
        >
          <SalesTrendChart branchId={selectedBranchId} />
        </MembershipLock>
        <MembershipLock
          isLocked={isMembershipExpired}
          description="Upgrade to view top selling products"
          actionText="Upgrade Now"
          onAction={handleUpgrade}
        >
          <TopSellingProducts branchId={selectedBranchId} />
        </MembershipLock>
      </div>
      {/* <ReportCategories />
      <RecentReportsTable /> */}
    </div>
  )
}

export default function ReportsAnalytics() {
  // const reportActions: HeaderAction[] = [
  //   {
  //     label: "Last 30 Days",
  //     icon: ChevronDown,
  //     onClick: () => {},
  //     variant: 'outline'
  //   },
  //   {
  //     label: "Export Report",
  //     icon: Download,
  //     onClick: () => {},
  //     variant: 'primary'
  //   },
  //   {
  //     label: "Print",
  //     icon: Printer,
  //     onClick: () => {},
  //     variant: 'secondary'
  //   }
  // ]

  return (
    <LayoutSkeleton
      header={
        <DynamicHeader
          maintext="Reports & Analytics"
          para="Comprehensive insights and analytics for your pharmacy"
          // children={<HeaderActions actions={reportActions} />}
        />
      }
    >
      <Suspense fallback={<LoadingFallback />}>
        <ReportsContent />
      </Suspense>
    </LayoutSkeleton>
  )
}
