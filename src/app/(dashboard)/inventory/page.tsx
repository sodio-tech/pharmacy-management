
"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Scan, Download, ListFilter as Filter, List, Grid2x2 as Grid, TriangleAlert as AlertTriangle, Package } from "lucide-react"
import { InventoryStats } from "./inventory-stats"
import { InventoryTable } from "./inventory-table"
import { AddProductModal } from "./add-product-modal"
import { BarcodeScanner } from "./barcode-scanner"
import { StockAlerts } from "./stock-alerts"
import { BatchTracking } from "./batch-tracking"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"
import { useState } from "react"

type InventoryContentProps = {
  isAddProductModalOpen: boolean
  setIsAddProductModalOpen: (open: boolean) => void
  isBarcodeScannerOpen: boolean
  setIsBarcodeScannerOpen: (open: boolean) => void
}

function InventoryContent({
  isAddProductModalOpen,
  setIsAddProductModalOpen,
  isBarcodeScannerOpen,
  setIsBarcodeScannerOpen,
}: InventoryContentProps) {
  const [activeTab, setActiveTab] = useState("inventory")
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleProductFound = (product: any) => {
    console.log("Product found:", product)
    setIsBarcodeScannerOpen(false)
    // Handle found product logic
  }

  const handleProductNotFound = (barcode: string) => {
    console.log("Product not found for barcode:", barcode)
    setIsBarcodeScannerOpen(false)
    setIsAddProductModalOpen(true)
    // Pre-fill barcode in add product form
  }

  const handleSaveProduct = (productData: any) => {
    console.log("Saving product:", productData)
    // Handle save product logic
  }

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    setIsAddProductModalOpen(true)
  }

  const handleViewBatch = (product: any) => {
    setActiveTab("batch-tracking")
  }

  const tabs = [
    { id: "inventory", label: "Inventory", icon: Package, count: 1247 },
    { id: "alerts", label: "Stock Alerts", icon: AlertTriangle, count: 23 },
    { id: "batch-tracking", label: "Batch Tracking", icon: Scan, count: 156 }
  ]

  return (
    <>
      <div className="bg-[#f9fafb]">
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200 bg-white rounded-lg">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? "border-teal-600 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${activeTab === tab.id ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800"
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "inventory" && (
          <>
            <InventoryStats />

            {/* Search and Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg border border-[#e5e7eb]">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                  <Input placeholder="Search by name, batch, or barcode..." className="pl-10 bg-white border-[#e5e7eb]" />
                </div>

                <Select defaultValue="all-categories">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Categories</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="otc">OTC</SelectItem>
                    <SelectItem value="supplement">Supplement</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all-stock">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-stock">All Stock Status</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    <SelectItem value="expiring">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>

                <div className="flex items-center gap-1 border border-[#e5e7eb] rounded">
                  <Button variant="ghost" size="sm" className="p-2">
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <InventoryTable
              onAddProduct={() => setIsAddProductModalOpen(true)}
              onEditProduct={handleEditProduct}
              onViewBatch={handleViewBatch}
            />
          </>
        )}

        {activeTab === "alerts" && <StockAlerts />}
        {activeTab === "batch-tracking" && <BatchTracking />}
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => {
          setIsAddProductModalOpen(false)
          setSelectedProduct(null)
        }}
        onSave={handleSaveProduct}
      />

      <BarcodeScanner
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onProductFound={handleProductFound}
        onProductNotFound={handleProductNotFound}
      />
    </>
  )
}

export default function InventoryManagement() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false)

  return (
    <LayoutSkeleton
      header={
        <DynamicHeader
          maintext="Inventory Management"
          para="Manage your pharmacy stock and medicine inventory"
          children={
            <div className="flex items-center gap-3">
              <Button
                className="bg-[#0f766e] hover:bg-[#0d6660] text-white gap-2"
                onClick={() => setIsAddProductModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
              <Button
                className="bg-[#14b8a6] hover:bg-[#0f9488] text-white gap-2"
                onClick={() => setIsBarcodeScannerOpen(true)}
              >
                <Scan className="w-4 h-4" />
                Scan Barcode
              </Button>
              <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          }
        />
      }
    >
      <InventoryContent
        isAddProductModalOpen={isAddProductModalOpen}
        setIsAddProductModalOpen={setIsAddProductModalOpen}
        isBarcodeScannerOpen={isBarcodeScannerOpen}
        setIsBarcodeScannerOpen={setIsBarcodeScannerOpen}
      />
    </LayoutSkeleton>
  )
}