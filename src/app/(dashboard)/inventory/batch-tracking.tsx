"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Calendar, TrendingUp, AlertTriangle, Clock } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { useUser } from "@/contexts/UserContext"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { useBranchSync } from "@/hooks/useBranchSync"
import { setSelectedBranch } from "@/store/slices/branchSlice"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-toastify"

interface BatchInfo {
  id: number
  product_id: number
  available_stock: number
  expiry_date: string
  manufacturer_name: string
  manufacturer_code: string
  notes?: string
  is_active: boolean
  batch_number: string
  batch_name: string
  product_name: string
  generic_name: string
  image?: string
}

interface ProductWithBatches {
  product_id: number
  product_name: string
  generic_name: string
  image?: string
  batches: BatchInfo[]
}

export function BatchTracking() {
  const { user } = useUser()
  const dispatch = useAppDispatch()
  const selectedBranchId = useAppSelector((state) => state.branch.selectedBranchId)
  const branches = useAppSelector((state) => state.branch.branches)
  const loadingBranches = useAppSelector((state) => state.branch.isLoading)
  
  // Sync branches to Redux
  useBranchSync(user?.pharmacy_id)
  
  const [allProducts, setAllProducts] = useState<ProductWithBatches[]>([])
  const [products, setProducts] = useState<ProductWithBatches[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [expiryFilter, setExpiryFilter] = useState("all")

  const fetchBatches = useCallback(async () => {
    if (!selectedBranchId) return

    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      // Map filter to API query params
      if (expiryFilter === "expiring") {
        params.append('expiry', 'in_30_days')
      } else if (expiryFilter === "good") {
        params.append('expiry', 'after_30_days')
      }
      // "all" and "expired" don't need query params
      
      const queryString = params.toString()
      const url = `/v1/inventory/batches/${selectedBranchId.toString()}${queryString ? `?${queryString}` : ''}`
      
      const response = await backendApi.get(url)
      const data = response.data?.data || response.data
      const batches: BatchInfo[] = data?.batches || []

      // Group batches by product_id
      const productMap = new Map<number, ProductWithBatches>()
      
      batches.forEach((batch) => {
        if (!productMap.has(batch.product_id)) {
          productMap.set(batch.product_id, {
            product_id: batch.product_id,
            product_name: batch.product_name,
            generic_name: batch.generic_name,
            image: batch.image,
            batches: [],
          })
        }
        productMap.get(batch.product_id)!.batches.push(batch)
      })

      let productsList = Array.from(productMap.values())

      // Apply expired filter (client-side for expired)
      if (expiryFilter === "expired") {
        productsList = productsList.map((product) => ({
          ...product,
          batches: product.batches.filter((batch) => {
            const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiry_date)
            return daysUntilExpiry < 0
          }),
        })).filter((product) => product.batches.length > 0)
      }

      setAllProducts(productsList)
    } catch (error: unknown) {
      console.error("Failed to load batch information:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedBranchId, expiryFilter])

  // Fetch batches when branch or filter changes
  useEffect(() => {
    if (selectedBranchId) {
      fetchBatches()
    }
  }, [selectedBranchId, expiryFilter, fetchBatches])

  // Apply search filter client-side
  useEffect(() => {
    let filtered = [...allProducts]

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.product_name.toLowerCase().includes(searchLower) ||
          product.generic_name.toLowerCase().includes(searchLower) ||
          product.batches.some((batch) =>
            batch.batch_number.toLowerCase().includes(searchLower) ||
            batch.batch_name.toLowerCase().includes(searchLower)
          )
      )
    }

    setProducts(filtered)
  }, [searchTerm, allProducts])

  const calculateDaysUntilExpiry = (expiryDate: string): number => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    expiry.setHours(0, 0, 0, 0)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getExpiryStatus = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return { status: "expired", color: "destructive", text: "Expired" }
    if (daysUntilExpiry <= 7) return { status: "critical", color: "destructive", text: "Critical" }
    if (daysUntilExpiry <= 30) return { status: "warning", color: "secondary", text: "Expiring Soon" }
    return { status: "good", color: "default", text: "Good" }
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
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Batch Tracking</h2>
          <p className="text-xs sm:text-sm text-gray-600">Monitor product batches and expiry dates</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Branch:</label>
          <Select
            value={selectedBranchId?.toString() || ""}
            onValueChange={(value) => dispatch(setSelectedBranch(value ? Number(value) : null))}
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
      </div>

      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
            <Input
              placeholder="Search products or batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm"
            />
          </div>

          <Select value={expiryFilter} onValueChange={setExpiryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by expiry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              <SelectItem value="expiring">Expiring Soon (≤30 days)</SelectItem>
              <SelectItem value="good">Good (&gt;30 days)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-3 sm:space-y-4">
        {products.map((product) => (
          <Card key={product.product_id} className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 bg-teal-100 rounded-lg flex-shrink-0">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{product.product_name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {product.generic_name}
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                    <Badge className="text-xs">{product.generic_name}</Badge>
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
                  const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiry_date)
                  const expiryStatus = getExpiryStatus(daysUntilExpiry)
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
                            Batch: {batch.batch_number}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{batch.batch_name}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs text-gray-600 mt-1">
                            <span>Qty: {batch.available_stock}</span>
                            <span className="truncate">Expires: {new Date(batch.expiry_date).toLocaleDateString()}</span>
                            {batch.manufacturer_name && (
                              <span className="truncate">Manufacturer: {batch.manufacturer_name}</span>
                            )}
                          </div>
                          {batch.notes && (
                            <p className="text-xs text-gray-500 mt-1 italic">{batch.notes}</p>
                          )}
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

      {products.length === 0 && !loading && (
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
