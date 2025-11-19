"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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

  const handleApplyFilters = () => {
    fetchTopSellingProducts()
    setDialogOpen(false)
  }

  const handleClearFilters = () => {
    setStartDate("")
    setEndDate("")
    setDialogOpen(false)
    // Filters will be cleared and data will refetch automatically via useEffect
  }

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
                    angle={0}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fontSize: 13 }}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Date Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
