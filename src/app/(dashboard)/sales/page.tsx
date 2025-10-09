"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button";
import { Plus, Scan, BarChart3 } from "lucide-react";
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
  return (
    <CartProvider>
      <LayoutSkeleton
        header={
          <DynamicHeader
            maintext="Sales & Point of Sale"
            para="Process sales transactions and manage customer orders"
            children={
              <div className="flex items-center gap-3">
                <Button className="bg-[#0f766e] hover:bg-[#0d6660] text-white gap-2">
                  <Plus className="w-4 h-4" />
                  New Sale
                </Button>
                <Button className="bg-[#14b8a6] hover:bg-[#0f766e] text-white gap-2">
                  <Scan className="w-4 h-4" />
                  Scan Barcode
                </Button>
                <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white gap-2">
                  <BarChart3 className="w-4 h-4" />
                  View Sales
                </Button>
              </div>
            }
          />
        }
      >
        <SalesContent />
      </LayoutSkeleton>
    </CartProvider>
  );
}
