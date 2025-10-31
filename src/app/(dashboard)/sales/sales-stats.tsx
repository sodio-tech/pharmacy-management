"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, DollarSign, Wallet } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { SalesStats as SalesStatsType } from "@/types/sales"

export function SalesStats() {
  const [stats, setStats] = useState<SalesStatsType | null>(null)
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       setLoading(true)
  //       const today = new Date()
  //       const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        
  //       const params = new URLSearchParams({
  //         start_date: startOfDay.toISOString(),
  //         end_date: today.toISOString()
  //       })
        
  //       const response = await backendApi.get(`/sales/stats/overview?${params.toString()}`)
  //       const salesStats = response.data?.data || response.data
        
  //       setStats(salesStats)
  //     } catch (error) {
  //       console.error('Error fetching sales stats:', error)
  //       // Use fallback data if API fails
  //       setStats({
  //         total_sales: 45280,
  //         total_amount: 45280,
  //         total_transactions: 127,
  //         average_sale: 356
  //       })
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchStats()
  // }, [])

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

  const statsData = [
    {
      title: "Today's Sales",
      value: `₹${(stats?.total_amount || 0).toLocaleString('en-IN')}`,
      change: "+12% from yesterday",
      changeType: "positive" as "positive" | "negative" | "neutral",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Transactions",
      value: stats?.total_transactions?.toString() || "0",
      change: "+8 from yesterday",
      changeType: "positive" as const,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Avg. Sale",
      value: `₹${(stats?.average_sale || 0).toLocaleString('en-IN')}`,
      change: "+5% increase",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Cash in Hand",
      value: "₹12,450",
      change: "Current balance",
      changeType: "neutral" as "positive" | "negative" | "neutral",
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
