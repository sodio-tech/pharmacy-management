"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search } from "lucide-react"
import { backendApi } from "@/lib/axios-config"

interface Product {
  product_id: number
  product_name: string
  generic_name: string | null
  barcode: string | null
  qrcode: string | null
  image: string | null
  manufacturer: string | null
  description: string | null
  units_sold: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    products: Product[]
  }
}

interface ChartData {
  name: string
  units_sold: number
}

interface TopSellingProductsProps {
  branchId: number | null
}

export function TopSellingProducts({ branchId }: TopSellingProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loadingAll, setLoadingAll] = useState(false)
  const [errorAll, setErrorAll] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

  const fetchTopSellingProducts = useCallback(async () => {
    if (!branchId) {
      setProducts([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("branch_id", branchId.toString())

      if (startDate) {
        params.append("start_date", startDate)
      }
      if (endDate) {
        params.append("end_date", endDate)
      }

      const response = await backendApi.get<ApiResponse>(
        `/v1/reports/top-selling-products?${params.toString()}`
      )

      if (response.data.success && response.data.data?.products) {
        setProducts(response.data.data.products)
      } else {
        setProducts([])
      }
    } catch (err: unknown) {
      console.error("Failed to fetch top selling products:", err)
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to load top selling products"
      setError(errorMessage)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [branchId, startDate, endDate])

  useEffect(() => {
    fetchTopSellingProducts()
  }, [fetchTopSellingProducts])

  const handleClearFilters = () => {
    setStartDate("")
    setEndDate("")
    setSearchTerm("")
    // Filters will be cleared and data will refetch automatically via useEffect
  }

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchAllProducts = useCallback(async () => {
    if (!branchId) {
      setAllProducts([])
      return
    }

    try {
      setLoadingAll(true)
      setErrorAll(null)

      const params = new URLSearchParams()
      params.append("branch_id", branchId.toString())
      params.append("limit", "100") // Higher limit for "View All"

      if (startDate) {
        params.append("start_date", startDate)
      }
      if (endDate) {
        params.append("end_date", endDate)
      }
      if (debouncedSearchTerm.trim()) {
        params.append("search", debouncedSearchTerm.trim())
      }

      const response = await backendApi.get<ApiResponse>(
        `/v1/reports/top-selling-products?${params.toString()}`
      )

      if (response.data.success && response.data.data?.products) {
        const sortedProducts = [...response.data.data.products].sort(
          (a, b) => parseInt(b.units_sold) - parseInt(a.units_sold)
        )
        setAllProducts(sortedProducts)
      } else {
        setAllProducts([])
      }
    } catch (err: unknown) {
      console.error("Failed to fetch all products:", err)
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to load products"
      setErrorAll(errorMessage)
      setAllProducts([])
    } finally {
      setLoadingAll(false)
    }
  }, [branchId, startDate, endDate, debouncedSearchTerm])

  useEffect(() => {
    if (dialogOpen) {
      fetchAllProducts()
    }
  }, [dialogOpen, branchId, startDate, endDate, debouncedSearchTerm, fetchAllProducts])

  const hasActiveFilters = startDate || endDate

  const chartData: ChartData[] = products
    .map((product) => ({
      name: product.product_name,
      units_sold: parseInt(product.units_sold) || 0,
    }))
    .sort((a, b) => b.units_sold - a.units_sold)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top Selling Products</CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : error ? (
            <div className="h-80 flex items-center justify-center">
              <p className="text-destructive">{error}</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    type="category" 
                    hide={true}
                  />
                  <YAxis 
                    type="number" 
                    tick={{ fontSize: 13 }}
                  />
                  <Tooltip />
                  <Bar dataKey="units_sold" fill="#0d9488" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Top Selling Products</DialogTitle>
            <DialogDescription>View all top selling products with search and date filters</DialogDescription>
          </DialogHeader>
          
          {/* Search and Date Filters */}
          <div className="space-y-4 py-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 w-full sm:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="space-y-2 sm:min-w-[150px]">
                  <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2 sm:min-w-[150px]">
                  <Label htmlFor="end-date" className="text-xs">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="h-9"
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-9"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="py-4">
            {loadingAll ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading products...</span>
              </div>
            ) : errorAll ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-destructive">{errorAll}</p>
              </div>
            ) : allProducts.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">Rank</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Units Sold</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allProducts.map((product, index) => (
                      <TableRow key={product.product_id}>
                        <TableCell className="text-center font-semibold text-gray-600">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                              <img
                                src={product.image || "/assets/fallback.jpg"}
                                alt={product.product_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/assets/fallback.jpg"
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {product.product_name}
                              </div>
                              {product.generic_name && (
                                <div className="text-sm text-gray-500 truncate">
                                  {product.generic_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-gray-900">
                          {parseInt(product.units_sold).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
