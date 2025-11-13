import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { backendApi } from "@/lib/axios-config"
import { useUser } from "@/contexts/UserContext"
import { useBranches } from "@/hooks/useBranches"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InventoryAnalytics {
  active_products: number
  total_products: number
  low_stock_batches: number
  out_of_stock_batches: number
  batches_expiring_within_30_days: number
  total_stock_value: number
}

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
  const { user } = useUser()
  const { branches, isLoading: loadingBranches } = useBranches(user?.pharmacy_id)
  const [selectedBranchId, setSelectedBranchId] = useState<string>("")
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

  // Auto-select first branch when branches are loaded
  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id.toString())
    }
  }, [branches, selectedBranchId])

  // Fetch analytics when branch is selected
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedBranchId) return

      try {
        setLoading(true)
        const response = await backendApi.get(`/v1/inventory/general-analytics/${selectedBranchId}`)
        const data = response.data?.data || response.data
        
        if (data) {
          const analytics = data as InventoryAnalytics
          setStats({
            totalProducts: analytics.active_products || analytics.total_products || 0,
            lowStockCount: analytics.low_stock_batches || 0,
            outOfStockCount: analytics.out_of_stock_batches || 0,
            expiringSoonCount: analytics.batches_expiring_within_30_days || 0,
            totalStockValue: analytics.total_stock_value || 0,
            totalStockUnits: 0, // Not provided in API response
            turnoverRate: 0, // Not provided in API response
          })
          setRealTimeUpdates(true)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
        toast.error("Failed to load analytics")
        setRealTimeUpdates(false)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [selectedBranchId])

  const statsCards = [
    {
      title: "Active Products",
      value: loading ? "..." : stats.totalProducts.toString(),
      change: "Total products",
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
    // {
    //   title: "Expiring Soon",
    //   value: loading ? "..." : stats.expiringSoonCount.toString(),
    //   change: "Within 30 days",
    //   changeType: stats.expiringSoonCount > 0 ? "warning" as const : "positive" as const,
    //   icon: "⏰",
    //   color: stats.expiringSoonCount > 0 ? "text-[#ca8a04]" : "text-[#16a34a]",
    //   bgColor: stats.expiringSoonCount > 0 ? "bg-[#fef9c3]" : "bg-[#dcfce7]",
    // },
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
    <div className="mb-6 w-full">
      {/* Branch Selector */}
      <div className="mb-6 flex w-full items-center justify-end">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Select Branch:</label>
          <Select
            value={selectedBranchId}
            onValueChange={setSelectedBranchId}
            disabled={loadingBranches || branches.length === 0}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder={loadingBranches ? "Loading..." : branches.length === 0 ? "No branches available" : "Select branch"} />
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
