import { Button } from "@/components/ui/button"
import { Download, Printer, ChevronDown } from "lucide-react"
import { ReportsStats } from "./reports-stats"
import { SalesTrendChart } from "./sales-trend-chart"
import { TopSellingProducts } from "./top-selling-products"
import { ReportCategories } from "./report-categories"
import { RecentReportsTable } from "./recent-reports-table"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"

function ReportsContent() {
  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <ReportsStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SalesTrendChart />
        <TopSellingProducts />
      </div>
      <ReportCategories />
      <RecentReportsTable />
    </div>
  )
}

export default function ReportsAnalytics() {
  return (
    <LayoutSkeleton
      header={
        <DynamicHeader
          maintext="Reports & Analytics"
          para="Comprehensive insights and analytics for your pharmacy"
          children={
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                Last 30 Days
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button className="bg-[#0f766e] hover:bg-[#0d6660] text-white gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button className="bg-[#14b8a6] hover:bg-[#0f766e] text-white gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          }
        />
      }
    >
      <ReportsContent />
    </LayoutSkeleton>
  )
}
