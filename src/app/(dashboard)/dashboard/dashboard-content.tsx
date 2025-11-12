"use client"

import { Plus, Upload, Package, TrendingUp, TrendingDown, AlertTriangle, Clock, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { backendApi } from "@/lib/axios-config"
import { useUser } from "@/contexts/UserContext"
import { useBranches } from "@/hooks/useBranches"

type PrescriptionStatus = "UPLOADED" | "PENDING_VALIDATION" | "VALIDATED" | "REJECTED"

interface DashboardPrescription {
  id: string
  patientName: string
  status: PrescriptionStatus
  amount?: number
  itemCount: number
  prescription_link?: string
}

interface ApiPrescriptionResponse {
  prescription_id: number
  customer_id: number
  customer_name: string
  doctor_name: string | null
  prescription_link: string
  prescription_notes: string
  created_at: string
}

interface LowStockProduct {
  product_id: number
  product_name: string
  generic_name: string
  available_stock: number
  min_stock: number
  max_stock: number
}

interface ExpiringProduct {
  product_id: number
  product_name: string
  generic_name: string
  image?: string
  expiry_date: string
}

export function DashboardContent() {
  const router = useRouter()
  const { user } = useUser()
  const { branches, isLoading: loadingBranches } = useBranches(user?.pharmacy_id)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedBranchId, setSelectedBranchId] = useState<string>("")
  const [lowStockItems, setLowStockItems] = useState<LowStockProduct[]>([])
  const [expiringItems, setExpiringItems] = useState<ExpiringProduct[]>([])
  const [recentPrescriptions, setRecentPrescriptions] = useState<DashboardPrescription[]>([])
  const [salesAnalytics, setSalesAnalytics] = useState<{ this_month_earnings: number; this_month_earnings_change_percent: number } | null>(null)
  const [supplierAnalytics, setSupplierAnalytics] = useState<{ this_month_orders: number; orders_percentage_change: number } | null>(null)

  // Auto-select first branch when branches are loaded
  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id.toString())
    }
  }, [branches, selectedBranchId])

  const fetchStockAlerts = useCallback(async () => {
    if (!selectedBranchId) return

    try {
      const response = await backendApi.get(`/v1/inventory/stock-alerts/${selectedBranchId}`)
      const data = response.data?.data || response.data
      setLowStockItems(data?.alerts || [])
    } catch (error) {
      console.error("Failed to load stock alerts:", error)
      setLowStockItems([])
    }
  }, [selectedBranchId])

  const fetchExpiringStock = useCallback(async () => {
    if (!selectedBranchId) return

    try {
      const response = await backendApi.get(`/v1/inventory/expiring-stock/${selectedBranchId}`)
      const data = response.data?.data || response.data
      setExpiringItems(data?.expiring_within_30_days || [])
    } catch (error) {
      console.error("Failed to load expiring stock:", error)
      setExpiringItems([])
    }
  }, [selectedBranchId])

  const fetchRecentPrescriptions = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.append('page', '1')
      params.append('limit', '5')

      const response = await backendApi.get(`/v1/customer/prescriptions?${params.toString()}`)
      const responseData = response.data?.data

      if (responseData?.prescriptions) {
        const mappedPrescriptions: DashboardPrescription[] = responseData.prescriptions.map((apiPrescription: ApiPrescriptionResponse) => ({
          id: apiPrescription.prescription_id.toString(),
          patientName: apiPrescription.customer_name,
          status: "UPLOADED" as PrescriptionStatus, // Default status, can be updated based on API response
          itemCount: 0, // Can be updated if API provides this
          prescription_link: apiPrescription.prescription_link,
        }))
        setRecentPrescriptions(mappedPrescriptions)
      } else {
        setRecentPrescriptions([])
      }
    } catch (error) {
      console.error("Failed to load recent prescriptions:", error)
      setRecentPrescriptions([])
    }
  }, [])

  const fetchSalesAnalytics = useCallback(async () => {
    if (!selectedBranchId) return

    try {
      const response = await backendApi.get(`/v1/sales/general-analytics/${selectedBranchId}`)
      const data = response.data?.data || response.data
      if (data) {
        setSalesAnalytics({
          this_month_earnings: data.this_month_earnings || 0,
          this_month_earnings_change_percent: data.this_month_earnings_change_percent || 0,
        })
      }
    } catch (error) {
      console.error("Failed to load sales analytics:", error)
      setSalesAnalytics(null)
    }
  }, [selectedBranchId])

  const fetchSupplierAnalytics = useCallback(async () => {
    try {
      const response = await backendApi.get("/v1/supplier/general-analytics")
      const data = response.data?.data || response.data
      if (data) {
        setSupplierAnalytics({
          this_month_orders: data.this_month_orders || 0,
          orders_percentage_change: data.orders_percentage_change || 0,
        })
      }
    } catch (error) {
      console.error("Failed to load supplier analytics:", error)
      setSupplierAnalytics(null)
    }
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = {
          kpis: {},
        }
        setDashboardData(data)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    fetchRecentPrescriptions()
    fetchSupplierAnalytics()
  }, [fetchRecentPrescriptions, fetchSupplierAnalytics])

  // Fetch stock alerts and expiring stock when branch is selected
  useEffect(() => {
    if (selectedBranchId) {
      fetchStockAlerts()
      fetchExpiringStock()
      fetchSalesAnalytics()
    }
  }, [selectedBranchId, fetchStockAlerts, fetchExpiringStock, fetchSalesAnalytics])

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-full">Loading dashboard...</div>
  }

  const kpis = dashboardData?.kpis || {}

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `₹${(salesAnalytics?.this_month_earnings || 0).toLocaleString()}`,
      change: `${(salesAnalytics?.this_month_earnings_change_percent || 0).toFixed(1)}% vs last month`,
      trend: (salesAnalytics?.this_month_earnings_change_percent || 0) >= 0 ? "up" : "down",
      icon: "₹",
      color: "bg-[#16a34a]",
    },
    {
      title: "Orders",
      value: (supplierAnalytics?.this_month_orders || 0).toString(),
      change: `${(supplierAnalytics?.orders_percentage_change || 0).toFixed(1)}% vs previous month`,
      trend: (supplierAnalytics?.orders_percentage_change || 0) >= 0 ? "up" : "down",
      icon: ShoppingCart,
      color: "bg-[#2563eb]",
    },
    {
      title: "Low Stock Items",
      value: lowStockItems.length.toString(),
      change: "Requires attention",
      trend: "warning",
      icon: AlertTriangle,
      color: "bg-[#ea580c]",
    },
    {
      title: "Expiring Soon",
      value: expiringItems.length.toString(),
      change: "Within 30 days",
      trend: "danger",
      icon: Clock,
      color: "bg-[#dc2626]",
    },
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {kpiCards.map((card, index) => (
          <Card key={index} className="bg-white border-[#e5e7eb] py-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center", card.color)}
                >
                  {typeof card.icon === "string" ? (
                    <span className="text-white text-lg sm:text-xl font-bold">{card.icon}</span>
                  ) : (
                    <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#6b7280] mb-1">{card.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">{card.value}</p>
                <div className="flex items-center gap-1">
                  {card.trend === "up" && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#16a34a]" />}
                  {card.trend === "down" && <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#dc2626]" />}
                  {card.trend === "warning" && <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-[#ea580c]" />}
                  {card.trend === "danger" && <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#dc2626]" />}
                  <span
                    className={cn(
                      "text-xs sm:text-sm",
                      card.trend === "up"
                        ? "text-[#16a34a]"
                        : card.trend === "down"
                          ? "text-[#dc2626]"
                          : card.trend === "warning"
                            ? "text-[#ea580c]"
                            : card.trend === "danger"
                              ? "text-[#dc2626]"
                              : "text-[#6b7280]",
                    )}
                  >
                    {card.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Prescriptions */}
        <div className="xl:col-span-2">
          <Card className="bg-white border-[#e5e7eb] h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl font-semibold text-[#111827]">Recent Prescriptions</CardTitle>
              <Button 
                onClick={() => router.push("/prescriptions")}
                variant="ghost" 
                className="text-[#0f766e] hover:text-[#0f766e]/80 text-sm sm:text-base"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex-1">
              <div className="space-y-4">
                {recentPrescriptions.map((prescription: DashboardPrescription, index: number) => {
               

                  return (
                    <div
                      key={prescription.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-[#f9fafb] rounded-lg"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        {prescription.prescription_link ? (
                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                            <AvatarImage src={prescription.prescription_link} alt={`Prescription ${prescription.id}`} className="object-cover" />
                            <AvatarFallback className="text-white font-bold text-sm sm:text-base bg-[#6b7280]">
                              Rx
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div
                            className={cn(
                              "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                              "bg-[#6b7280]",
                            )}
                          >
                            <span className="text-white font-bold text-sm sm:text-base">Rx</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#111827] text-sm sm:text-base truncate">
                            Prescription ID: {prescription.id}
                          </p>
                          <p className="text-xs sm:text-sm text-[#6b7280]">Patient: {prescription.patientName}</p>
                        </div>
                      </div>
                        
                    </div>
                  )
                })}
                {recentPrescriptions.length === 0 && (
                  <div className="text-center py-8 text-[#6b7280] text-sm sm:text-base">No recent prescriptions</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="bg-white border-[#e5e7eb] h-full flex flex-col">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl font-semibold text-[#111827]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex-1">
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push("/sales")}
                  className="w-full h-12 sm:h-[55px] bg-[#0f766e] hover:bg-[#0f766e]/90 text-white justify-start gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  New Sale
                </Button>
                <Button 
                  onClick={() => router.push("/prescriptions")}
                  className="w-full h-12 sm:h-[55px] bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white justify-start gap-2 text-sm sm:text-base"
                >
                  <Upload className="w-4 h-4" />
                  Upload Prescription
                </Button>
                <Button 
                  onClick={() => router.push("/inventory")}
                  className="w-full h-12 sm:h-[55px] bg-[#06b6d4] hover:bg-[#06b6d4]/90 text-white justify-start gap-2 text-sm sm:text-base"
                >
                  <Package className="w-4 h-4" />
                  Add Inventory
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
        {/* Low Stock Alerts */}
        <Card className="bg-white border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-[#111827]">Low Stock Alerts</CardTitle>
            <Badge variant="secondary" className="bg-[#fef9c3] text-[#854d0e] text-xs sm:text-sm">
              {lowStockItems.length} Items
            </Badge>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {lowStockItems.map((item: LowStockProduct, index: number) => (
                <div
                  key={item.product_id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-[#fef2f2]"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-xl sm:text-2xl">💊</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#111827] text-sm sm:text-base">{item.product_name}</p>
                      <p className="text-xs sm:text-sm text-[#6b7280]">
                        Only {item.available_stock} left (Min: {item.min_stock})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {lowStockItems.length === 0 && (
                <div className="text-center py-8 text-[#6b7280] text-sm sm:text-base">No low stock items</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expiry Tracking */}
        <Card className="bg-white border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-[#111827]">Expiry Tracking</CardTitle>
            <Badge variant="secondary" className="bg-[#fee2e2] text-[#991b1b] text-xs sm:text-sm">
              {expiringItems.length} Items
            </Badge>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-4">
              {expiringItems.map((item: ExpiringProduct, index: number) => {
                const daysToExpiry = Math.ceil(
                  (new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                )
                const bgColor =
                  daysToExpiry <= 5 ? "bg-[#fef2f2]" : daysToExpiry <= 15 ? "bg-[#fff7ed]" : "bg-[#fefce8]"
    

                return (
                  <div
                    key={item.product_id}
                    className={cn(
                      "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg",
                      bgColor,
                    )}
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {item.image ? (
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                          <AvatarImage src={item.image} alt={item.product_name} className="object-cover" />
                          <AvatarFallback className="bg-[#e5e7eb] text-[#6b7280] text-xs">
                            {item.product_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <span className="text-xl sm:text-2xl">💊</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#111827] text-sm sm:text-base">{item.product_name}</p>
                        <p className="text-xs sm:text-sm text-[#6b7280]">Expires in {daysToExpiry} days</p>
                      </div>
                    </div>
                    
                  </div>
                )
              })}
              {expiringItems.length === 0 && (
                <div className="text-center py-8 text-[#6b7280] text-sm sm:text-base">No items expiring soon</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
