"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, FileText, IndianRupee, Clock } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"

interface SupplierAnalytics {
  supplier_actvity: {
    active_suppliers: number
    new_this_month: number
  }
  purchase_stats: {
    pending_purchases: number
    pending_purchase_amount: number
  }
  spending_this_month: {
    total: number
    percentage_increase_from_prev_month: number | null
  }
  on_time_delivery_rate: number | null
}

export function SupplierStats() {
  const [analytics, setAnalytics] = useState<SupplierAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await backendApi.get("/v1/supplier/general-analytics")
      const data = response.data?.data || response.data
      setAnalytics(data)
    } catch (error: unknown) {
      console.error("Failed to fetch supplier analytics:", error)
      // Set fallback data
      setAnalytics({
        supplier_actvity: {
          active_suppliers: 0,
          new_this_month: 0,
        },
        purchase_stats: {
          pending_purchases: 0,
          pending_purchase_amount: 0,
        },
        spending_this_month: {
          total: 0,
          percentage_increase_from_prev_month: null,
        },
        on_time_delivery_rate: null,
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    return `₹${amount.toLocaleString("en-IN")}`
  }

  const formatPendingAmount = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L pending`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K pending`
    }
    return `₹${amount.toLocaleString("en-IN")} pending`
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-3 px-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
                <div className="h-12 w-12 bg-muted rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = analytics || {
    supplier_actvity: {
      active_suppliers: 0,
      new_this_month: 0,
    },
    purchase_stats: {
      pending_purchases: 0,
      pending_purchase_amount: 0,
    },
    spending_this_month: {
      total: 0,
      percentage_increase_from_prev_month: null,
    },
    on_time_delivery_rate: null,
  }

  // Safe getters with default values
  const onTimeDeliveryRate = stats.on_time_delivery_rate ?? 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="py-4">
        <CardContent className="p-3 px-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Suppliers</p>
              <p className="text-3xl font-bold">{stats.supplier_actvity.active_suppliers}</p>
              <p className="text-sm text-green-600">
                {stats.supplier_actvity.new_this_month > 0
                  ? `+${stats.supplier_actvity.new_this_month} this month`
                  : "No new suppliers"}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardContent className="p-3 px-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending POs</p>
              <p className="text-3xl font-bold">{stats.purchase_stats.pending_purchases}</p>
              <p className="text-sm text-orange-600">
                {stats.purchase_stats.pending_purchase_amount > 0
                  ? formatPendingAmount(stats.purchase_stats.pending_purchase_amount)
                  : "No pending amount"}
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardContent className="p-3 px-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Spend</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.spending_this_month.total)}</p>
              <p className="text-sm text-purple-600">
                {stats.spending_this_month.percentage_increase_from_prev_month !== null
                  ? `+${stats.spending_this_month.percentage_increase_from_prev_month}% from last month`
                  : "No previous data"}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardContent className="p-3 px-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">On-Time Delivery</p>
              <p className="text-3xl font-bold">
                {stats.on_time_delivery_rate !== null && stats.on_time_delivery_rate !== undefined
                  ? `${onTimeDeliveryRate.toFixed(1)}%`
                  : "N/A"}
              </p>
              <p className="text-sm text-green-600">
                {stats.on_time_delivery_rate !== null && stats.on_time_delivery_rate !== undefined
                  ? onTimeDeliveryRate >= 90
                    ? "Excellent performance"
                    : onTimeDeliveryRate >= 70
                      ? "Good performance"
                      : "Needs improvement"
                  : "No data available"}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
