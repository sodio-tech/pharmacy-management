import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { backendApi } from "@/lib/axios-config"

interface InventorySummary {
  totalProducts: number
  lowStockCount: number
  outOfStockCount: number
  expiringSoonCount: number
  totalStockValue: number
  totalStockUnits: number
  turnoverRate: number
}

export function InventoryStats() {
  const [stats, setStats] = useState<InventorySummary>({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    expiringSoonCount: 0,
    totalStockValue: 0,
    totalStockUnits: 0,
    turnoverRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [realTimeUpdates, setRealTimeUpdates] = useState(false)

  useEffect(() => {
    fetchStats()

    // Set up real-time updates
    const interval = setInterval(() => {
      fetchStats()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await backendApi.get('/inventory/stock')
      const data = response.data?.data || response.data
      setStats(data.summary || data)
      setRealTimeUpdates(true)
    } catch (error: unknown) {
      toast.error("Failed to load inventory statistics")
      setRealTimeUpdates(false)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: "Total Products",
      value: loading ? "..." : stats.totalProducts.toString(),
      change: "Active products",
      changeType: "positive" as const,
      icon: "📦",
      color: "text-[#2563eb]",
      bgColor: "bg-[#dbeafe]",
    },
    {
      title: "Low Stock",
      value: loading ? "..." : stats.lowStockCount.toString(),
      change: stats.lowStockCount > 0 ? "Need attention" : "All good",
      changeType: stats.lowStockCount > 0 ? "negative" as const : "positive" as const,
      icon: "⚠️",
      color: stats.lowStockCount > 0 ? "text-[#ea580c]" : "text-[#16a34a]",
      bgColor: stats.lowStockCount > 0 ? "bg-[#ffedd5]" : "bg-[#dcfce7]",
    },
    {
      title: "Out of Stock",
      value: loading ? "..." : stats.outOfStockCount.toString(),
      change: stats.outOfStockCount > 0 ? "Urgent restock needed" : "All in stock",
      changeType: stats.outOfStockCount > 0 ? "negative" as const : "positive" as const,
      icon: "🔴",
      color: stats.outOfStockCount > 0 ? "text-[#dc2626]" : "text-[#16a34a]",
      bgColor: stats.outOfStockCount > 0 ? "bg-[#fee2e2]" : "bg-[#dcfce7]",
    },
    {
      title: "Expiring Soon",
      value: loading ? "..." : stats.expiringSoonCount.toString(),
      change: "Within 30 days",
      changeType: stats.expiringSoonCount > 0 ? "warning" as const : "positive" as const,
      icon: "⏰",
      color: stats.expiringSoonCount > 0 ? "text-[#ca8a04]" : "text-[#16a34a]",
      bgColor: stats.expiringSoonCount > 0 ? "bg-[#fef9c3]" : "bg-[#dcfce7]",
    },
    {
      title: "Stock Value",
      value: loading ? "..." : `₹${stats.totalStockValue.toLocaleString()}`,
      change: `${stats.totalStockUnits} units`,
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
            <span className={`text-xs ${stat.changeType === "positive" ? "text-green-600" :
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
