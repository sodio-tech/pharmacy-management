"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"
import { OrderStatus } from "./components/types"
import { getOrderStatusDisplay, getOrderStatusColor } from "./components/utils"

interface PurchaseOrder {
  id: number
  purchase_date: string
  pharmacy_id: number
  purchase_amount: number
  expected_delivery_date: string
  fulfilled_on: string | null
  status: OrderStatus | string
  supplier_name: string
  phone_number: string
  product_categories: string[]
  gstin: string
}

interface PerformanceReport {
  supplier_name: string
  supplier_id: number
  on_time_deliveries: number
  total_deliveries: number
  percentage: number | null
}

export function SupplierBottomSections() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingPerformance, setLoadingPerformance] = useState(true)

  useEffect(() => {
   
    fetchPurchaseOrders()
    fetchPerformanceReport()
  }, [])

  const fetchPurchaseOrders = async () => {
    try {
      setLoadingOrders(true)
      const response = await backendApi.get("/v1/orders/list?page=1&limit=2")
      const data = response.data?.data || response.data
      const orders = data.orders || []
      setPurchaseOrders(orders)
    } catch (error: unknown) {
      console.error("Failed to fetch purchase orders:", error)
      toast.error("Failed to load purchase orders")
      setPurchaseOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }

  const fetchPerformanceReport = async () => {
    try {
      setLoadingPerformance(true)
      const response = await backendApi.get("/v1/supplier/performance-report")
      const data = response.data?.data || response.data
      const report = data.report || []
      setPerformanceReport(report)
    } catch (error: unknown) {
      console.error("Failed to fetch performance report:", error)
      toast.error("Failed to load performance report")
      setPerformanceReport([])
    } finally {
      setLoadingPerformance(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Recent Purchase Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Recent Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingOrders ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex items-center justify-between animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-5 bg-muted rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : purchaseOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No purchase orders found</p>
            </div>
          ) : (
            purchaseOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order id: {order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.supplier_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(order.purchase_amount)}</p>
                  <Badge
                    variant="secondary"
                    className={getOrderStatusColor(order.status)}
                  >
                    {getOrderStatusDisplay(order.status)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingPerformance ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3 animate-pulse">
                  <div className="h-12 w-12 bg-muted rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-40"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : performanceReport.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No performance data available</p>
            </div>
          ) : (
            performanceReport.map((supplier) => (
              <div key={supplier.supplier_id} className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{supplier.supplier_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {supplier.percentage !== null
                      ? `${supplier.percentage.toFixed(1)}% delivery rate`
                      : "N/A - No data available"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {supplier.on_time_deliveries} / {supplier.total_deliveries}
                  </p>
                  <p className="text-xs text-muted-foreground">On-time deliveries</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
