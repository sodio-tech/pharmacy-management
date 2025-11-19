"use client"

import { ReportsStats } from "./reports-stats"
import { SalesTrendChart } from "./sales-trend-chart"
import { TopSellingProducts } from "./top-selling-products"
// import { ReportCategories } from "./report-categories"
// import { RecentReportsTable } from "./recent-reports-table"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"
import { useAppSelector } from "@/store/hooks"
import { useUser } from "@/contexts/UserContext"
import { useBranchSync } from "@/hooks/useBranchSync"

function ReportsContent() {
  const { user } = useUser()
  const selectedBranchId = useAppSelector((state) => state.branch.selectedBranchId)
  
  // Sync branches to Redux
  useBranchSync(user?.pharmacy_id)

  return (
    <div className="bg-[#f9fafb]">
      <ReportsStats branchId={selectedBranchId} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SalesTrendChart branchId={selectedBranchId} />
        <TopSellingProducts branchId={selectedBranchId} />
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
      <ReportsContent />
    </LayoutSkeleton>
  )
}
