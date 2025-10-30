
"use client"
import { Button } from "@/components/ui/button"
import { Plus, Scan, Download, TriangleAlert as AlertTriangle, Package, Shield } from "lucide-react"
import { HeaderActions, HeaderAction } from "@/components/HeaderActions"
import { InventoryStats } from "./inventory-stats"
import { InventoryTable } from "./inventory-table"
import { AddProductModal } from "./add-product-modal"
import { BarcodeScanner } from "./barcode-scanner"
import { StockAlerts } from "./stock-alerts"
import { BatchTracking } from "./batch-tracking"
import { AddBatchModal } from "./components/AddBatchModal"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"
import { useState } from "react"
import { useSession } from "@/lib/auth-client"

type InventoryContentProps = {
  isAddProductModalOpen: boolean
  setIsAddProductModalOpen: (open: boolean) => void
  isBarcodeScannerOpen: boolean
  setIsBarcodeScannerOpen: (open: boolean) => void
  canAddProducts?: boolean
}

function InventoryContent({
  isAddProductModalOpen,
  setIsAddProductModalOpen,
  isBarcodeScannerOpen,
  setIsBarcodeScannerOpen,
  canAddProducts = true,
}: InventoryContentProps) {
  const [activeTab, setActiveTab] = useState("inventory")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false)
  const [selectedProductForBatch, setSelectedProductForBatch] = useState<string | null>(null)

  const handleProductFound = (product: any) => {
    setIsBarcodeScannerOpen(false)
    // Handle found product logic
  }

  const handleProductNotFound = (barcode: string) => {
    setIsBarcodeScannerOpen(false)
    setIsAddProductModalOpen(true)
    // Pre-fill barcode in add product form
  }

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    setIsAddProductModalOpen(true)
  }

  const handleViewBatch = (product: any) => {
    setActiveTab("batch-tracking")
  }

  const handleAddBatch = (productId: string) => {
    setSelectedProductForBatch(productId)
    setIsAddBatchModalOpen(true)
  }

  const handleBatchSuccess = () => {
    setIsAddBatchModalOpen(false)
    setSelectedProductForBatch(null)
    // Refresh data if needed
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
          <div className="flex gap-2 md:gap-4 lg:gap-8 px-4 md:px-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 md:gap-2 py-3 md:py-4 px-2 md:px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap snap-start flex-shrink-0 ${activeTab === tab.id
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`inline-flex items-center justify-center px-1.5 md:px-2 py-0.5 md:py-1 text-xs font-bold rounded-full ${activeTab === tab.id ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg p-3 sm:p-6">
          {activeTab === "inventory" && (
            <>
              <InventoryStats />
              <InventoryTable
                onAddProduct={() => setIsAddProductModalOpen(true)}
                onEditProduct={handleEditProduct}
                onViewBatch={handleViewBatch}
                onAddBatch={handleAddBatch}
                canAddProducts={canAddProducts}
              />
            </>
          )}

          {activeTab === "alerts" && <StockAlerts />}
          {activeTab === "batch-tracking" && <BatchTracking />}
        </div>
      </div>

      {/* Batch Modal */}
      {isAddBatchModalOpen && selectedProductForBatch && (
        <AddBatchModal
          productId={selectedProductForBatch}
          onClose={() => {
            setIsAddBatchModalOpen(false)
            setSelectedProductForBatch(null)
          }}
          onSuccess={handleBatchSuccess}
        />
      )}

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        product={selectedProduct}
        onClose={() => {
          setIsAddProductModalOpen(false)
          setSelectedProduct(null)
        }}
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
  const { data: session } = useSession()
  const user = session?.user
  // @ts-ignore
  const canAddProducts = user?.role === 'ADMIN'

  const inventoryActions: HeaderAction[] = canAddProducts ? [
    {
      label: "Add Product",
      icon: Plus,
      onClick: () => setIsAddProductModalOpen(true),
      variant: 'primary'
    },
    {
      label: "Scan Barcode",
      icon: Scan,
      onClick: () => setIsBarcodeScannerOpen(true),
      variant: 'secondary'
    },
    {
      label: "Export",
      icon: Download,
      onClick: () => { },
      variant: 'tertiary'
    }
  ] : [
    {
      label: "Export",
      icon: Download,
      onClick: () => { },
      variant: 'tertiary'
    }
  ]

  return (
    <LayoutSkeleton
      header={
        <DynamicHeader
          maintext="Inventory Management"
          para="Manage your pharmacy stock and medicine inventory"
          children={
            <HeaderActions actions={inventoryActions}>
              {!canAddProducts && (
                <div className="flex items-center justify-center gap-2 text-gray-500 h-10 sm:h-11 text-sm">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Read-only access</span>
                </div>
              )}
            </HeaderActions>
          }
        />
      }
    >
      <InventoryContent
        isAddProductModalOpen={isAddProductModalOpen}
        setIsAddProductModalOpen={setIsAddProductModalOpen}
        isBarcodeScannerOpen={isBarcodeScannerOpen}
        setIsBarcodeScannerOpen={setIsBarcodeScannerOpen}
        canAddProducts={canAddProducts}
      />
    </LayoutSkeleton>
  )
}