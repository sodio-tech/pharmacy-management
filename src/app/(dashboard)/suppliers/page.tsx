"use client"
import { useEffect } from "react"
// import { Plus, FileText } from "lucide-react"
// import { HeaderActions, type HeaderAction } from "@/components/HeaderActions"
import { SupplierStats } from "./supplier-stats"
import { SupplierTable } from "./supplier-table"
import { SupplierBottomSections } from "./supplier-bottom-sections"
// import LayoutSkeleton from "@/components/layout-skeleton"
// import DynamicHeader from "@/components/DynamicHeader"
// import { AddSupplierDialog } from "./add-supplier-dialog"
// import { NewPODialog } from "./new-po-dialog"
// import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"

// function SupplierContent() {
//   return (
//     <div className="bg-[#f9fafb]">
//       <SupplierStats />
//       <SupplierTable />
//       <SupplierBottomSections />
//     </div>
//   )
// }

export default function SupplierManagement() {
  const router = useRouter()
  // const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)
  // const [isNewPOOpen, setIsNewPOOpen] = useState(false)
  // const { user } = useUser()

  // const isPharmacist = user?.role === "PHARMACIST"

  // const supplierActions: HeaderAction[] = isPharmacist
  //   ? []
  //   : [
  //       {
  //         label: "Add Supplier",
  //         icon: Plus,
  //         onClick: () => setIsAddSupplierOpen(true),
  //         variant: "primary",
  //       },
  //       {
  //         label: "New PO",
  //         icon: FileText,
  //         onClick: () => setIsNewPOOpen(true),
  //         variant: "secondary",
  //       },
  //     ]

  useEffect(() => {
    router.replace("/dashboard")
  }, [router])

  return (
    // <>
    //   <LayoutSkeleton
    //     header={
    //       <DynamicHeader
    //         maintext="Supplier Management"
    //         para="Manage suppliers, purchase orders, and vendor relationships"
    //         children={supplierActions.length > 0 ? <HeaderActions actions={supplierActions} /> : null}
    //       />
    //     }
    //   >
    //     <SupplierContent />
    //   </LayoutSkeleton>

    //   <AddSupplierDialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen} />
    //   <NewPODialog open={isNewPOOpen} onOpenChange={setIsNewPOOpen} />
    // </>
    null
  )
}
