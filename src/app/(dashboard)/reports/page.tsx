"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportsStats } from "./reports-stats"
import { SalesTrendChart } from "./sales-trend-chart"
import { TopSellingProducts } from "./top-selling-products"
// import { ReportCategories } from "./report-categories"
// import { RecentReportsTable } from "./recent-reports-table"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"
import { useBranches } from "@/hooks/useBranches"
import { useUser } from "@/contexts/UserContext"

function ReportsContent() {
  const { user } = useUser()
  const { branches, isLoading: branchesLoading } = useBranches(user?.pharmacy_id)
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)

  // Set first branch as default when branches are loaded
  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id)
    }
  }, [branches, selectedBranchId])

  return (
    <div className="bg-[#f9fafb]">
      <div className="mb-4 flex items-center justify-end">
        <Select
          value={selectedBranchId?.toString() || ""}
          onValueChange={(value) => setSelectedBranchId(Number(value))}
          disabled={branchesLoading || branches.length === 0}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id.toString()}>
                {branch.branch_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
