"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Package, TrendingDown, RefreshCw, X } from "lucide-react"
import { inventoryService, type LowStockProduct, type ExpiringProduct } from "@/services/inventoryService"
import { toast } from "react-toastify"

export function StockAlerts() {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [expiringProducts, setExpiringProducts] = useState<ExpiringProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const data = await inventoryService.getInventoryStock()
      setLowStockProducts(data.alerts.lowStockProducts)
      setExpiringProducts(data.alerts.expiringProducts)
    } catch (error: any) {
      toast.error("Failed to load stock alerts")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchAlerts()
  }

  const getSeverityColor = (product: LowStockProduct) => {
    const stockRatio = product.currentStock / product.minStockLevel
    if (stockRatio === 0) return "destructive"
    if (stockRatio <= 0.5) return "destructive"
    if (stockRatio <= 1) return "secondary"
    return "default"
  }

  const getExpiryColor = (daysUntilExpiry: number) => {
    if (daysUntilExpiry <= 7) return "destructive"
    if (daysUntilExpiry <= 15) return "secondary"
    return "default"
  }

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
      <div className="flex flex-row justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Stock Alerts</h2>
          <p className="text-xs sm:text-sm text-gray-600">Monitor low stock and expiring products</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="gap-2 self-start sm:self-auto bg-transparent"
        >
          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <Card className="p-3 sm:p-4 md:p-6">
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
                key={product.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Current: {product.currentStock} | Min: {product.minStockLevel}
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                      <Badge className={`text-xs`}>{product.category}</Badge>
                      {product.barcode && (
                        <span className="text-xs text-gray-500 hidden sm:inline">Barcode: {product.barcode}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Badge variant={getSeverityColor(product)} className="text-xs">
                    {product.currentStock === 0 ? "Out of Stock" : "Low Stock"}
                  </Badge>
                  <Button size="sm" variant="outline" className="text-xs h-8 bg-transparent">
                    Restock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-3 sm:p-4 md:p-6">
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
            {expiringProducts.map((product) => (
              <div key={product.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{product.batches.length} batch(es) expiring soon</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-8 self-end sm:self-auto bg-transparent">
                    View Details
                  </Button>
                </div>

                <div className="ml-4 sm:ml-8 space-y-1.5 sm:space-y-2">
                  {product.batches.map((batch) => (
                    <div
                      key={batch.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2.5 sm:p-3 bg-white rounded border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">Batch: {batch.batchNumber}</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Qty: {batch.quantity} | Expires: {new Date(batch.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Badge variant={getExpiryColor(batch.daysUntilExpiry)} className="text-xs">
                          {batch.daysUntilExpiry} days
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
