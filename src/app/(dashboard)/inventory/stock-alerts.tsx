"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  Clock, 
  Package, 
  TrendingDown,
  RefreshCw,
  X
} from "lucide-react"
import { inventoryService, LowStockProduct, ExpiringProduct } from "@/services/inventoryService"
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
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stock Alerts</h2>
          <p className="text-gray-600">Monitor low stock and expiring products</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Low Stock Alerts */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
            <p className="text-sm text-gray-600">
              {lowStockProducts.length} products need attention
            </p>
          </div>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">All Good!</h4>
            <p className="text-gray-600">No low stock alerts at the moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Current: {product.currentStock} | Min: {product.minStockLevel}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                      {product.barcode && (
                        <span className="text-xs text-gray-500">
                          Barcode: {product.barcode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(product)}>
                    {product.currentStock === 0 ? "Out of Stock" : "Low Stock"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Restock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Expiring Products */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Expiring Soon</h3>
            <p className="text-sm text-gray-600">
              {expiringProducts.length} products expiring within 30 days
            </p>
          </div>
        </div>

        {expiringProducts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">All Good!</h4>
            <p className="text-gray-600">No products expiring soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expiringProducts.map((product) => (
              <div key={product.id} className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">
                        {product.batches.length} batch(es) expiring soon
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
                
                {/* Batch Details */}
                <div className="ml-8 space-y-2">
                  {product.batches.map((batch) => (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between p-3 bg-white rounded border"
                    >
                      <div>
                        <p className="font-medium text-sm">Batch: {batch.batchNumber}</p>
                        <p className="text-xs text-gray-600">
                          Quantity: {batch.quantity} | Expires: {new Date(batch.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getExpiryColor(batch.daysUntilExpiry)}>
                          {batch.daysUntilExpiry} days
                        </Badge>
                        <Button size="sm" variant="ghost">
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

// Helper function for category colors
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    OTC: "bg-blue-100 text-blue-800",
    PRESCRIPTION: "bg-red-100 text-red-800",
    SUPPLEMENTS: "bg-green-100 text-green-800",
    MEDICAL_DEVICES: "bg-purple-100 text-purple-800",
    COSMETICS: "bg-pink-100 text-pink-800",
    OTHER: "bg-gray-100 text-gray-800"
  }
  return colors[category] || colors.OTHER
}