"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, DollarSign, Wallet } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { formatPercentage } from "@/lib/utils"

interface SalesStatsProps {
  branchId?: string
}

interface ApiAnalyticsResponse {
  success: boolean
  message: string
  data: {
    today_earnings: number
    earnings_change_percent: number
    today_avg_earnings: number
    avg_earnings_change_percent: number
    today_transactions: number
    transactions_change_percent: number
    this_month_earnings: number
    this_month_earnings_change_percent: number
  }
}

export function SalesStats({ branchId }: SalesStatsProps) {
  const [stats, setStats] = useState<ApiAnalyticsResponse['data'] | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStats = useCallback(async () => {
    if (!branchId) {
      setStats(null)
      return
    }

    try {
      setLoading(true)
      const response = await backendApi.get<ApiAnalyticsResponse>(`/v1/sales/general-analytics/${branchId}`)
      const data = response.data?.data

      if (data) {
        setStats(data)
      } else {
        setStats(null)
      }
    } catch (error: unknown) {
      console.error('Error fetching sales stats:', error)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [branchId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const formatChange = (percent: number): { text: string; type: "positive" | "negative" | "neutral" } => {
    const formatted = formatPercentage(percent)
    if (percent > 0) {
      return { text: `+${formatted}`, type: "positive" }
    } else if (percent < 0) {
      return { text: formatted, type: "negative" }
    }
    return { text: "0.00%", type: "neutral" }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="relative py-0 overflow-hidden animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
                <div className="p-3 rounded-full bg-muted">
                  <div className="h-6 w-6 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const earningsChange = stats ? formatChange(stats.earnings_change_percent) : { text: "0%", type: "neutral" as const }
  const avgChange = stats ? formatChange(stats.avg_earnings_change_percent) : { text: "0%", type: "neutral" as const }
  const transactionsChange = stats ? formatChange(stats.transactions_change_percent) : { text: "0%", type: "neutral" as const }

  const statsData = [
    {
      title: "Today's Sales",
      value: `₹${(stats?.today_earnings || 0).toLocaleString('en-IN')}`,
      change: `${earningsChange.text} from yesterday`,
      changeType: earningsChange.type,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Transactions",
      value: stats?.today_transactions?.toString() || "0",
      change: `${transactionsChange.text} from yesterday`,
      changeType: transactionsChange.type,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Avg. Sale",
      value: `₹${(stats?.today_avg_earnings || 0).toLocaleString('en-IN')}`,
      change: `${avgChange.text} from yesterday`,
      changeType: avgChange.type,
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "This Month",
      value: `₹${(stats?.this_month_earnings || 0).toLocaleString('en-IN')}`,
      change: stats ? `${formatChange(stats.this_month_earnings_change_percent).text} change` : "0% change",
      changeType: stats ? formatChange(stats.this_month_earnings_change_percent).type : "neutral" as const,
      icon: Wallet,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="relative py-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p
                    className={`text-xs ${stat.changeType === "positive"
                        ? "text-green-600"
                        : stat.changeType === "negative"
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
