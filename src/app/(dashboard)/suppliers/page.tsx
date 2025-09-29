import { Button } from "@/components/ui/button"
import { Plus, FileText, BarChart3 } from "lucide-react"
import { SupplierStats } from "./supplier-stats"
import { SupplierTable } from "./supplier-table"
import { SupplierBottomSections } from "./supplier-bottom-sections"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"

function SupplierContent() {
  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <SupplierStats />
      <SupplierTable />
      <SupplierBottomSections />
    </div>
  )
}

export default function SupplierManagement() {
  return (
    <LayoutSkeleton
      header={
        <DynamicHeader
          maintext="Supplier Management"
          para="Manage suppliers, purchase orders, and vendor relationships"
          children={
            <div className="flex items-center gap-3">
              <Button className="bg-[#0f766e] hover:bg-[#0d6660] text-white gap-2">
                <Plus className="w-4 h-4" />
                Add Supplier
              </Button>
              <Button className="bg-[#14b8a6] hover:bg-[#0f766e] text-white gap-2">
                <FileText className="w-4 h-4" />
                New PO
              </Button>
              <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </div>
          }
        />
      }
    >
      <SupplierContent />
    </LayoutSkeleton>
  )
}
