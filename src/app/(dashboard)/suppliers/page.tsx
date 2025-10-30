"use client"

import { Button } from "@/components/ui/button"
import { Plus, FileText, BarChart3 } from "lucide-react"
import { HeaderActions, HeaderAction } from "@/components/HeaderActions"
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
  const supplierActions: HeaderAction[] = [
    {
      label: "Add Supplier",
      icon: Plus,
      onClick: () => {},
      variant: 'primary'
    },
    {
      label: "New PO",
      icon: FileText,
      onClick: () => {},
      variant: 'secondary'
    },
    {
      label: "Analytics",
      icon: BarChart3,
      onClick: () => {},
      variant: 'tertiary'
    }
  ]

  return (
    <LayoutSkeleton
      header={
        <DynamicHeader
          maintext="Supplier Management"
          para="Manage suppliers, purchase orders, and vendor relationships"
          children={<HeaderActions actions={supplierActions} />}
        />
      }
    >
      <SupplierContent />
    </LayoutSkeleton>
  )
}
