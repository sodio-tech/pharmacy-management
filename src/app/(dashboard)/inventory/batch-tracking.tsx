"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Package, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  Clock,
  Filter
} from "lucide-react"
import { inventoryService, Product } from "@/services/inventoryService"
import { toast } from "react-toastify"

interface BatchInfo {
  id: string
  batchNumber: string
  currentQuantity: number
  costPrice: number
  expiryDate: string
  daysUntilExpiry: number
}

interface ProductWithBatches extends Product {
  batches: BatchInfo[]
}

export function BatchTracking() {
  const [products, setProducts] = useState<ProductWithBatches[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [expiryFilter, setExpiryFilter] = useState("all")

  useEffect(() => {
    fetchProductsWithBatches()
  }, [searchTerm, expiryFilter])

  const fetchProductsWithBatches = async () => {
    try {
      setLoading(true)
      const response = await inventoryService.getProducts({
        search: searchTerm,
        limit: 50
      })
      
      // For each product, get its stock details including batches
      const productsWithBatches = await Promise.all(
        response.data.map(async (product) => {
          try {
            const stockData = await inventoryService.getProductStock(product.id)
            return {
              ...product,
              batches: stockData.stock.batches
            }
          } catch (error: any) {
            return {
              ...product,
              batches: []
            }
          }
        })
      )
      
      setProducts(productsWithBatches)
    } catch (error: any) {
      toast.error("Failed to load batch information")
    } finally {
      setLoading(false)
    }
  }

  const getExpiryStatus = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return { status: "expired", color: "destructive", text: "Expired" }
    if (daysUntilExpiry <= 7) return { status: "critical", color: "destructive", text: "Critical" }
    if (daysUntilExpiry <= 30) return { status: "warning", color: "secondary", text: "Expiring Soon" }
    return { status: "good", color: "default", text: "Good" }
  }

  const filteredProducts = products.filter(product => {
    if (expiryFilter === "expired") {
      return product.batches.some(batch => batch.daysUntilExpiry < 0)
    }
    if (expiryFilter === "expiring") {
      return product.batches.some(batch => batch.daysUntilExpiry <= 30 && batch.daysUntilExpiry > 0)
    }
    if (expiryFilter === "good") {
      return product.batches.every(batch => batch.daysUntilExpiry > 30)
    }
    return true
  })

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
          <h2 className="text-2xl font-bold text-gray-900">Batch Tracking</h2>
          <p className="text-gray-600">Monitor product batches and expiry dates</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Batches</option>
            <option value="expired">Expired</option>
            <option value="expiring">Expiring Soon (≤30 days)</option>
            <option value="good">Good (&gt;30 days)</option>
          </select>
        </div>
      </Card>

      {/* Products and Batches */}
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Package className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {product.generic_name || product.manufacturer}
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
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Batches</p>
                <p className="text-2xl font-bold text-teal-600">{product.batches.length}</p>
              </div>
            </div>

            {/* Batches */}
            {product.batches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No batch information available</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {product.batches.map((batch) => {
                  const expiryStatus = getExpiryStatus(batch.daysUntilExpiry)
                  return (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Calendar className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Batch: {batch.batchNumber}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Qty: {batch.currentQuantity}</span>
                            <span>Cost: ₹{batch.costPrice}</span>
                            <span>Expires: {new Date(batch.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={expiryStatus.color as any}>
                          {expiryStatus.text}
                        </Badge>
                        {expiryStatus.status === "critical" && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        {expiryStatus.status === "warning" && (
                          <Clock className="w-4 h-4 text-orange-500" />
                        )}
                        {expiryStatus.status === "good" && (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="p-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">
            {searchTerm || expiryFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No products with batch information available"}
          </p>
        </Card>
      )}
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