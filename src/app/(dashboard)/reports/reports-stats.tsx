"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, DollarSign, Percent } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"

interface AnalyticsData {
  today_earnings: number
  earnings_change_percent: number
  today_avg_earnings: number
  avg_earnings_change_percent: number
  today_transactions: number
  transactions_change_percent: number
  this_month_earnings: number
  this_month_earnings_change_percent: number
  this_month_transactions: number
  this_month_transactions_change_percent: number
  this_month_avg_earnings: number
  this_month_avg_earnings_change_percent: number
}

interface ReportsStatsProps {
  branchId: number | null
}

export function ReportsStats({ branchId }: ReportsStatsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchAnalytics = useCallback(async (branchId: number) => {
    try {
      setIsLoading(true)
      const response = await backendApi.get(`/v1/sales/general-analytics/${branchId}`)

      if (response.data?.success && response.data?.data) {
        setAnalyticsData(response.data.data)
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setAnalyticsData(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch analytics data when branch is selected
  useEffect(() => {
    if (branchId) {
      fetchAnalytics(branchId)
    } else {
      setAnalyticsData(null)
    }
  }, [branchId, fetchAnalytics])

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    return `₹${amount.toFixed(0)}`
  }

  const formatChange = (percent: number, label: string) => {
    const sign = percent >= 0 ? "+" : ""
    return `${sign}${percent.toFixed(1)}% ${label}`
  }

  const stats = analyticsData
    ? [
      {
        title: "Total Revenue",
        value: formatCurrency(analyticsData.this_month_earnings),
        change: formatChange(
          analyticsData.this_month_earnings_change_percent,
          "from last month"
        ),
        changeType: analyticsData.this_month_earnings_change_percent >= 0 ? ("positive" as const) : ("negative" as const),
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Total Orders",
        value: analyticsData.this_month_transactions.toString(),
        change: formatChange(
          analyticsData.this_month_transactions_change_percent,
          "from last month"
        ),
        changeType: analyticsData.this_month_transactions_change_percent >= 0 ? ("positive" as const) : ("negative" as const),
        icon: ShoppingCart,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Average Order Value",
        value: formatCurrency(analyticsData.this_month_avg_earnings),
        change: formatChange(
          analyticsData.this_month_avg_earnings_change_percent,
          "from last month"
        ),
        changeType: analyticsData.this_month_avg_earnings_change_percent >= 0 ? ("positive" as const) : ("negative" as const),
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        title: "Profit Margin",
        value: "24.8%",
        change: "+2.3% from last month",
        changeType: "positive" as const,
        icon: Percent,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
    ]
    : []

  return (
    <div className="mb-8">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="relative py-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analyticsData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="relative py-0 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {branchId
              ? "Loading analytics data..."
              : "Select a branch to view analytics"}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
