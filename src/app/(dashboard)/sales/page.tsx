"use client"

import { useState, useEffect, Suspense } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// import { Plus, Scan, BarChart3 } from "lucide-react";
// import { HeaderActions, HeaderAction } from "@/components/HeaderActions";
import { SalesStats } from "./sales-stats";
import { ProductCategories } from "./product-categories";
import { RecentTransactions } from "./recent-transactions";
import { CurrentSaleSidebar } from "./current-sale-sidebar";
import LayoutSkeleton from "@/components/layout-skeleton";
import DynamicHeader from "@/components/DynamicHeader";
import { MedicineInventory } from "./medicine-inventory";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { useAppSelector } from "@/store/hooks";
import { useUser } from "@/contexts/UserContext";
import { useBranchSync } from "@/hooks/useBranchSync";
import { LoadingFallback } from "@/components/loading-fallback";

function SalesContent() {
  const { user } = useUser()
  const selectedBranchId = useAppSelector((state) => state.branch.selectedBranchId)
  
  // Sync branches to Redux
  useBranchSync(user?.pharmacy_id)
  
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { addToCart } = useCart()

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-6 w-full">
        {/* Main Content */}

        <div className="lg:col-span-4 bg-[#f9fafb] rounded-lg w-full">

          <SalesStats branchId={selectedBranchId} />
          <div className="mb-8">
            <RecentTransactions branchId={selectedBranchId} />

            <ProductCategories
              onCategorySelect={setSelectedCategory}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              selectedBranchId={selectedBranchId}
            />
          </div>
          <MedicineInventory
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onAddToCart={addToCart}
          />

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3 w-full">
          <CurrentSaleSidebar branchId={selectedBranchId} />
        </div>
      </div>
    </>

  );
}

export default function SalesAndPOS() {
  // const salesActions: HeaderAction[] = [
  //   {
  //     label: "New Sale",
  //     icon: Plus,
  //     onClick: () => {},
  //     variant: 'primary'
  //   },
  //   {
  //     label: "Scan Barcode",
  //     icon: Scan,
  //     onClick: () => {},
  //     variant: 'secondary'
  //   },
  //   {
  //     label: "View Sales",
  //     icon: BarChart3,
  //     onClick: () => {},
  //     variant: 'tertiary'
  //   }
  // ]

  return (
    <CartProvider>
      <LayoutSkeleton
        header={
          <DynamicHeader
            maintext="Sales & Point of Sale"
            para="Process sales transactions and manage customer orders"
          // children={<HeaderActions actions={salesActions} />}
          />
        }
      >
        <Suspense fallback={<LoadingFallback />}>
          <SalesContent />
        </Suspense>
      </LayoutSkeleton>
    </CartProvider>
  );
}
