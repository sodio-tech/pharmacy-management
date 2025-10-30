"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button";
import { Plus, Scan, BarChart3 } from "lucide-react";
import { HeaderActions, HeaderAction } from "@/components/HeaderActions";
import { SalesStats } from "./sales-stats";
import { ProductCategories } from "./product-categories";
import { RecentTransactions } from "./recent-transactions";
import { CurrentSaleSidebar } from "./current-sale-sidebar";
import LayoutSkeleton from "@/components/layout-skeleton";
import DynamicHeader from "@/components/DynamicHeader";
import { MedicineInventory } from "./medicine-inventory";
import { CartProvider, useCart } from "@/contexts/CartContext";

function SalesContent() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { addToCart } = useCart()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
      {/* Main Content */}
      <div className="lg:col-span-2 bg-[#f9fafb] rounded-lg">
        <SalesStats />
        <div className="mb-8">
          <ProductCategories 
            onCategorySelect={setSelectedCategory}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
          />
        </div>
        <MedicineInventory 
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          onAddToCart={addToCart}
        />
        <RecentTransactions />
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 w-full">
        <CurrentSaleSidebar />
      </div>
    </div>
  );
}

export default function SalesAndPOS() {
  const salesActions: HeaderAction[] = [
    {
      label: "New Sale",
      icon: Plus,
      onClick: () => {},
      variant: 'primary'
    },
    {
      label: "Scan Barcode",
      icon: Scan,
      onClick: () => {},
      variant: 'secondary'
    },
    {
      label: "View Sales",
      icon: BarChart3,
      onClick: () => {},
      variant: 'tertiary'
    }
  ]

  return (
    <CartProvider>
      <LayoutSkeleton
        header={
          <DynamicHeader
            maintext="Sales & Point of Sale"
            para="Process sales transactions and manage customer orders"
            children={<HeaderActions actions={salesActions} />}
          />
        }
      >
        <SalesContent />
      </LayoutSkeleton>
    </CartProvider>
  );
}
