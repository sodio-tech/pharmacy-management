import { Suspense } from "react"
import { DashboardContent } from "@/app/(dashboard)/dashboard/dashboard-content"
import DynamicHeader from "@/components/DynamicHeader"
import LayoutSkeleton from "@/components/layout-skeleton"
import { LoadingFallback } from "@/components/loading-fallback"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Bell, ChevronDown, Search } from "lucide-react"

const page = () => {
  return (
    <LayoutSkeleton
      children={
        <Suspense fallback={<LoadingFallback />}>
          <DashboardContent />
        </Suspense>
      }
      header={
        <DynamicHeader
          maintext="Pharmacy Dashboard"
          para="Welcome back, manage your pharmacy operations"
          // children={
          //   <div className="flex flex-wrap items-center gap-2 lg:gap-4">
          //     <div className="relative flex-1 lg:flex-initial min-w-[200px]">
          //       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
          //       <Input
          //         placeholder="Search medicines, orders..."
          //         className="pl-10 w-full lg:w-80 bg-[#f9fafb] border-[#e5e7eb]"
          //       />
          //     </div>
          //     <div className="items-center hidden lg:flex gap-2 lg:gap-4">
          //       <div className="relative">
          //         <Button variant="ghost" size="icon" className="relative">
          //           <Bell className="w-5 h-5 text-[#6b7280]" />
          //           <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#dc2626] text-white text-xs rounded-full flex items-center justify-center">
          //             3
          //           </span>
          //         </Button>
          //       </div>
          //       <div className="hidden lg:flex items-center gap-2 text-[#6b7280] text-sm">
          //         <span>Branch: Main Store</span>
          //         <ChevronDown className="w-4 h-4" />
          //       </div>
          //     </div>
          //   </div>
          // }
        />
      }
    />
  )
}

export default page
