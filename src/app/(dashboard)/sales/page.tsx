"use client"

import { useState, Suspense } from "react"
import { SalesStats } from "./sales-stats";
import { ProductCategories } from "./product-categories";
import { RecentTransactions } from "./recent-transactions";
import { CurrentSaleSidebar } from "./current-sale-sidebar";
import LayoutSkeleton from "@/components/layout-skeleton";
import DynamicHeader from "@/components/DynamicHeader";
import { MembershipLock } from "@/components/membership-lock";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { useAppSelector } from "@/store/hooks";
import { useUser } from "@/contexts/UserContext";
import { useBranchSync } from "@/hooks/useBranchSync";
import { useRouter } from "next/navigation";
import { LoadingFallback } from "@/components/loading-fallback";

function SalesContent() {
  const { user } = useUser()
  const selectedBranchId = useAppSelector((state) => state.branch.selectedBranchId)
  const isMembershipExpired = useAppSelector((state) => state.ui.isMembershipExpired)
  const router = useRouter()
  
  // Sync branches to Redux
  useBranchSync(user?.pharmacy_id)
  
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleUpgrade = () => {
    router.push("/pricing")
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4 xl:gap-6 w-full">
        {/* Main Content */}

        <div className="xl:col-span-4 bg-[#f9fafb] rounded-lg w-full">
          <MembershipLock
            isLocked={isMembershipExpired}
            description="Upgrade to view sales statistics"
            actionText="Upgrade Now"
            onAction={handleUpgrade}
          >
            <SalesStats branchId={selectedBranchId} />
          </MembershipLock>
          <div className="mb-8">
            <MembershipLock
              isLocked={isMembershipExpired}
              description="Upgrade to view recent transactions"
              actionText="Upgrade Now"
              onAction={handleUpgrade}
            >
              <RecentTransactions branchId={selectedBranchId} />
            </MembershipLock>

            <MembershipLock
              isLocked={isMembershipExpired}
              description="Upgrade to browse product categories"
              actionText="Upgrade Now"
              onAction={handleUpgrade}
            >
              <ProductCategories
                onCategorySelect={setSelectedCategory}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                selectedBranchId={selectedBranchId}
              />
            </MembershipLock>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-3 w-full">
          <MembershipLock
            isLocked={isMembershipExpired}
            description="Upgrade to process sales"
            actionText="Upgrade Now"
            onAction={handleUpgrade}
          >
            <CurrentSaleSidebar branchId={selectedBranchId} />
          </MembershipLock>
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
