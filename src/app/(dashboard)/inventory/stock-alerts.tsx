"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Package, TrendingDown, RefreshCw, X } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { useUser } from "@/contexts/UserContext"
import { useBranches } from "@/hooks/useBranches"
import { AddProductModal } from "./add-product-modal"
import { Product } from "@/types/sales"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// import { toast } from "react-toastify"
// import { TabNavigation } from "./tab-navigation"
import { TabType } from "./tab-navigation"

interface LowStockProduct {
  product_id: number
  product_name: string
  generic_name: string
  image?: string
  available_stock: number
  min_stock: number
  max_stock: number
}

interface ExpiringProduct {
  product_id: number
  product_name: string
  generic_name: string
  image?: string
  expiry_date: string
}

export function StockAlerts() {
  const { user } = useUser()
  const { branches, isLoading: loadingBranches } = useBranches(user?.pharmacy_id)
  const [selectedBranchId, setSelectedBranchId] = useState<string>("")
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  // const [expiringProducts, setExpiringProducts] = useState<ExpiringProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("lowStock")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Auto-select first branch when branches are loaded
  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id.toString())
    }
  }, [branches, selectedBranchId])

  const fetchAlerts = useCallback(async () => {
    if (!selectedBranchId) return

    try {
      setLoading(true)
      
      if (activeTab === "lowStock") {
        const response = await backendApi.get(`/v1/inventory/stock-alerts/${selectedBranchId}`)
        const data = response.data?.data || response.data
        setLowStockProducts(data?.alerts || [])
      } 
      // else {
      //   const response = await backendApi.get(`/v1/inventory/expiring-stock/${selectedBranchId}`)
      //   const data = response.data?.data || response.data
      //   setExpiringProducts(data?.expiring_within_30_days || [])
      // }
    } catch (error: unknown) {
      console.error("Failed to load stock alerts:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedBranchId, activeTab])

  // Fetch alerts when branch is selected or tab changes
  useEffect(() => {
    if (selectedBranchId) {
      fetchAlerts()
    }
  }, [selectedBranchId, activeTab, fetchAlerts])

  const handleRefresh = () => {
    fetchAlerts()
  }

  const handleRestock = (product: LowStockProduct) => {
    // Convert LowStockProduct to Product format for the modal
    const productForModal: Product = {
      id: product.product_id,
      name: product.product_name,
      generic_name: product.generic_name,
      image_url: product.image || null,
      branch_id: selectedBranchId ? parseInt(selectedBranchId) : undefined,
    }
    setSelectedProduct(productForModal)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleModalSuccess = () => {
    // Refresh the alerts after successful product update
    fetchAlerts()
    handleModalClose()
  }

  const getSeverityColor = (product: LowStockProduct) => {
    const stockRatio = product.available_stock / product.min_stock
    if (stockRatio === 0) return "destructive"
    if (stockRatio <= 0.5) return "destructive"
    if (stockRatio <= 1) return "secondary"
    return "default"
  }

  // const getExpiryColor = (daysUntilExpiry: number) => {
  //   if (daysUntilExpiry <= 7) return "destructive"
  //   if (daysUntilExpiry <= 15) return "secondary"
  //   return "default"
  // }

  // const calculateDaysUntilExpiry = (expiryDate: string): number => {
  //   const expiry = new Date(expiryDate)
  //   const today = new Date()
  //   today.setHours(0, 0, 0, 0)
  //   expiry.setHours(0, 0, 0, 0)
  //   const diffTime = expiry.getTime() - today.getTime()
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  //   return diffDays
  // }

  if (loading) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Stock Alerts</h2>
          <p className="text-xs sm:text-sm text-gray-600">Monitor low stock and expiring products</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Branch:</label>
            <Select
              value={selectedBranchId}
              onValueChange={setSelectedBranchId}
              disabled={loadingBranches || branches.length === 0}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={loadingBranches ? "Loading..." : branches.length === 0 ? "No branches" : "Select branch"} />
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
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
            disabled={!selectedBranchId || loading}
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <Card className="p-3 sm:p-4 md:p-6">
        {/* <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} /> */}

        <div className="mt-4 sm:mt-6">
          {activeTab === "lowStock" && (
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">Low Stock Alerts</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{lowStockProducts.length} products need attention</p>
                </div>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">All Good!</h4>
                  <p className="text-xs sm:text-sm text-gray-600">No low stock alerts at the moment.</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg flex-shrink-0">
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{product.product_name}</h4>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Current: {product.available_stock} | Min: {product.min_stock} | Max: {product.max_stock}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                            <Badge className={`text-xs`}>{product.generic_name}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Badge variant={getSeverityColor(product)} className="text-xs">
                          {product.available_stock === 0 ? "Out of Stock" : "Low Stock"}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-8 bg-transparent"
                          onClick={() => handleRestock(product)}
                        >
                          Restock
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* {activeTab === "expiring" && (
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">Expiring Soon</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {expiringProducts.length} products expiring within 30 days
                  </p>
                </div>
              </div>

              {expiringProducts.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">All Good!</h4>
                  <p className="text-xs sm:text-sm text-gray-600">No products expiring soon.</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {expiringProducts.map((product) => {
                    const daysUntilExpiry = calculateDaysUntilExpiry(product.expiry_date)
                    return (
                      <div key={product.product_id} className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">{product.product_name}</h4>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {product.generic_name}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Expires: {new Date(product.expiry_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <Badge variant={getExpiryColor(daysUntilExpiry)} className="text-xs">
                              {daysUntilExpiry} {daysUntilExpiry === 1 ? "day" : "days"} left
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8 self-end sm:self-auto bg-transparent"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )} */}
        </div>
      </Card>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        branchId={selectedBranchId ? parseInt(selectedBranchId) : null}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
