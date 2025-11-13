"use client"

import { useState, useEffect } from "react"
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
import { useBranches } from "@/hooks/useBranches";
import { useUser } from "@/contexts/UserContext";

function SalesContent() {
  const { user } = useUser()
  const { branches, isLoading: loadingBranches } = useBranches(user?.pharmacy_id)
  const [selectedBranchId, setSelectedBranchId] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { addToCart } = useCart()

  // Auto-select first branch when branches are loaded
  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id.toString())
    }
  }, [branches, selectedBranchId])

  return (
    <>
      {/* Branch Selection */}
      <div className="flex gap-3 items-center mt-4 mb-4">
        <Label htmlFor="branch">Select Branch:</Label>
        <div className="flex-1">
          <Select value={selectedBranchId} onValueChange={setSelectedBranchId} disabled={loadingBranches || !branches.length}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loadingBranches ? "Loading branches..." : "Select branch"} />
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
        {/* Main Content */}

        <div className="lg:col-span-2 bg-[#f9fafb] rounded-lg">

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
        <div className="lg:col-span-1 w-full">
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
        <SalesContent />
      </LayoutSkeleton>
    </CartProvider>
  );
}
