import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface StatsData {
  totalProducts: number
  lowStockCount: number
  expiringSoonCount: number
  totalStockValue: number
}

export function InventoryStats() {
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
    totalStockValue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/inventory/stock")
      if (response.ok) {
        const data = await response.json()
        setStats(data.summary || {
          totalProducts: 0,
          lowStockCount: 0,
          expiringSoonCount: 0,
          totalStockValue: 0,
        })
      } else {
        console.log("Failed to fetch stats, using defaults")
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: "Total Products",
      value: loading ? "..." : stats.totalProducts.toString(), 
      change: "+12 this week",
      changeType: "positive" as const,
      icon: "📦",
      color: "text-[#2563eb]",
      bgColor: "bg-[#dbeafe]",
    },
    {
      title: "Low Stock",
      value: loading ? "..." : stats.lowStockCount.toString(),
      change: "Need attention", 
      changeType: "negative" as const,
      icon: "⚠️",
      color: "text-[#ea580c]",
      bgColor: "bg-[#ffedd5]",
    },
    {
      title: "Out of Stock",
      value: loading ? "..." : "0",
      change: "All in stock",
      changeType: "positive" as const,
      icon: "🔴",
      color: "text-[#dc2626]",
      bgColor: "bg-[#fee2e2]",
    },
    {
      title: "Expiring Soon",
      value: loading ? "..." : stats.expiringSoonCount.toString(),
      change: "Within 30 days",
      changeType: "warning" as const,
      icon: "⏰",
      color: "text-[#ca8a04]",
      bgColor: "bg-[#fef9c3]",
    },
    {
      title: "Total Stock Units",
      value: loading ? "..." : stats.totalStockValue.toString(),
      change: "Total inventory",
      changeType: "positive" as const,
      icon: "💰",
      color: "text-[#16a34a]",
      bgColor: "bg-[#dcfce7]",
    },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statsCards.map((stat, index) => (
        <Card key={index} className="p-6 bg-white border border-[#e5e7eb] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-[#6b7280] mb-1">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-xs ${
              stat.changeType === "positive" ? "text-green-600" :
              stat.changeType === "negative" ? "text-red-600" :
              stat.changeType === "warning" ? "text-yellow-600" :
              "text-gray-600"
            }`}>
              {stat.changeType === "positive" && "↗"}
              {stat.changeType === "negative" && "↘"}
              {stat.changeType === "warning" && "⚠"}
              {stat.change}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}
