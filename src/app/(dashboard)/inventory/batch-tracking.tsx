"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Calendar, TrendingUp, AlertTriangle, Clock } from "lucide-react"
import { toast } from "react-toastify"
import { Product } from "@/types/sales"
import { backendApi } from "@/lib/axios-config"

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
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      params.append('limit', '50')
      
      const response = await backendApi.get(`/products?${params.toString()}`)
      const products = response.data?.data || response.data || []

      const productsWithBatches = await Promise.all(
        products.map(async (product: Product) => {
          try {
            const stockResponse = await backendApi.get(`/products/${product.id}/stock`)
            const stockData = stockResponse.data?.data || stockResponse.data
            return {
              ...product,
              batches: stockData?.stock?.batches || stockData?.batches || [],
            }
          } catch (error: unknown) {
            return {
              ...product,
              batches: [],
            }
          }
        }),
      )

      setProducts(productsWithBatches)
    } catch (error: unknown) {
      console.error("Failed to load batch information:", error)
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

  const filteredProducts = products.filter((product) => {
    if (expiryFilter === "expired") {
      return product.batches.some((batch) => batch.daysUntilExpiry < 0)
    }
    if (expiryFilter === "expiring") {
      return product.batches.some((batch) => batch.daysUntilExpiry <= 30 && batch.daysUntilExpiry > 0)
    }
    if (expiryFilter === "good") {
      return product.batches.every((batch) => batch.daysUntilExpiry > 30)
    }
    return true
  })

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Batch Tracking</h2>
          <p className="text-xs sm:text-sm text-gray-600">Monitor product batches and expiry dates</p>
        </div>
      </div>

      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm"
            />
          </div>

          <select
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Batches</option>
            <option value="expired">Expired</option>
            <option value="expiring">Expiring Soon (≤30 days)</option>
            <option value="good">Good (&gt;30 days)</option>
          </select>
        </div>
      </Card>

      <div className="space-y-3 sm:space-y-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 bg-teal-100 rounded-lg flex-shrink-0">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {product.generic_name || product.manufacturer}
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                    <Badge className={`text-xs }`}>{product.category}</Badge>
                    {product.barcode && (
                      <span className="text-xs text-gray-500 hidden sm:inline">Barcode: {product.barcode}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right self-start sm:self-auto">
                <p className="text-xs text-gray-600">Total Batches</p>
                <p className="text-xl sm:text-2xl font-bold text-teal-600">{product.batches.length}</p>
              </div>
            </div>

            {product.batches.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                <p className="text-xs sm:text-sm">No batch information available</p>
              </div>
            ) : (
              <div className="grid gap-2 sm:gap-3">
                {product.batches.map((batch) => {
                  const expiryStatus = getExpiryStatus(batch.daysUntilExpiry)
                  return (
                    <div
                      key={batch.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                        <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            Batch: {batch.batchNumber}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs text-gray-600 mt-1">
                            <span>Qty: {batch.currentQuantity}</span>
                            <span>Cost: ₹{batch.costPrice}</span>
                            <span className="truncate">Expires: {new Date(batch.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                        <Badge variant={expiryStatus.color as any} className="text-xs">
                          {expiryStatus.text}
                        </Badge>
                        {expiryStatus.status === "critical" && (
                          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                        )}
                        {expiryStatus.status === "warning" && (
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                        )}
                        {expiryStatus.status === "good" && (
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
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
        <Card className="p-6 sm:p-8 text-center">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
          <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">No Products Found</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            {searchTerm || expiryFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No products with batch information available"}
          </p>
        </Card>
      )}
    </div>
  )
}
