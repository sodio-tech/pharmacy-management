"use client"

import { Plus, Upload, Package, FileText, TrendingUp, AlertTriangle, Clock, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type PrescriptionStatus = "UPLOADED" | "PENDING_VALIDATION" | "VALIDATED" | "REJECTED"

interface Prescription {
  id: string
  patientName: string
  status: PrescriptionStatus
  amount?: number
  itemCount: number
}

export function DashboardContent() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = {
          kpis: {
            totalRevenue: {
              value: 100000,
              change: 10,
              trend: "up",
            },
          },
          recentPrescriptions: [],
          lowStockItems: [],
          expiringItems: [],
        }
        setDashboardData(data)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-full">Loading dashboard...</div>
  }

  const kpis = dashboardData?.kpis || {}
  const recentPrescriptions = dashboardData?.recentPrescriptions || []
  const lowStockItems = kpis.lowStockItems?.items || []
  const expiringItems = kpis.expiringItems?.batches || []

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `₹${(kpis.totalRevenue?.value || 0).toLocaleString()}`,
      change: `${(kpis.totalRevenue?.change || 0).toFixed(1)}% vs last month`,
      trend: kpis.totalRevenue?.trend || "up",
      icon: "₹",
      color: "bg-[#16a34a]",
    },
    {
      title: "Orders Today",
      value: (kpis.ordersToday?.value || 0).toString(),
      change: `${(kpis.ordersToday?.change || 0).toFixed(1)}% vs yesterday`,
      trend: kpis.ordersToday?.trend || "up",
      icon: ShoppingCart,
      color: "bg-[#2563eb]",
    },
    {
      title: "Low Stock Items",
      value: (kpis.lowStockItems?.value || 0).toString(),
      change: "Requires attention",
      trend: "warning",
      icon: AlertTriangle,
      color: "bg-[#ea580c]",
    },
    {
      title: "Expiring Soon",
      value: (kpis.expiringItems?.value || 0).toString(),
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
                  {card.trend === "warning" && <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-[#ea580c]" />}
                  {card.trend === "danger" && <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#dc2626]" />}
                  <span
                    className={cn(
                      "text-xs sm:text-sm",
                      card.trend === "up"
                        ? "text-[#16a34a]"
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
              <Button variant="ghost" className="text-[#0f766e] hover:text-[#0f766e]/80 text-sm sm:text-base">
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex-1">
              <div className="space-y-4">
                {recentPrescriptions.map((prescription: Prescription, index: number) => {
                  const statusColor: Record<PrescriptionStatus, string> = {
                    UPLOADED: "bg-[#dbeafe] text-[#1e40af]",
                    PENDING_VALIDATION: "bg-[#fef9c3] text-[#854d0e]",
                    VALIDATED: "bg-[#dcfce7] text-[#166534]",
                    REJECTED: "bg-[#fee2e2] text-[#991b1b]",
                  }

                  const iconColor: Record<PrescriptionStatus, string> = {
                    VALIDATED: "bg-[#0f766e]",
                    PENDING_VALIDATION: "bg-[#ea580c]",
                    REJECTED: "bg-[#dc2626]",
                    UPLOADED: "bg-[#2563eb]",
                  }

                  const appliedStatusColor = statusColor[prescription.status] || "bg-[#f3f4f6] text-[#374151]"
                  const appliedIconColor = iconColor[prescription.status] || "bg-[#6b7280]"

                  return (
                    <div
                      key={prescription.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-[#f9fafb] rounded-lg"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                            appliedIconColor,
                          )}
                        >
                          <span className="text-white font-bold text-sm sm:text-base">Rx</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#111827] text-sm sm:text-base truncate">
                            {prescription.id.slice(0, 12)}...
                          </p>
                          <p className="text-xs sm:text-sm text-[#6b7280]">Patient: {prescription.patientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-[#111827] text-sm sm:text-base">
                            ₹{prescription.amount?.toLocaleString() || "0"}
                          </p>
                          <p className="text-xs sm:text-sm text-[#6b7280]">{prescription.itemCount} items</p>
                        </div>
                        <Badge className={cn("px-2 sm:px-3 py-1 text-xs whitespace-nowrap", appliedStatusColor)}>
                          {prescription.status}
                        </Badge>
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
                <Button className="w-full h-12 sm:h-[55px] bg-[#0f766e] hover:bg-[#0f766e]/90 text-white justify-start gap-2 text-sm sm:text-base">
                  <Plus className="w-4 h-4" />
                  New Sale
                </Button>
                <Button className="w-full h-12 sm:h-[55px] bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white justify-start gap-2 text-sm sm:text-base">
                  <Upload className="w-4 h-4" />
                  Upload Prescription
                </Button>
                <Button className="w-full h-12 sm:h-[55px] bg-[#06b6d4] hover:bg-[#06b6d4]/90 text-white justify-start gap-2 text-sm sm:text-base">
                  <Package className="w-4 h-4" />
                  Add Inventory
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 sm:h-[55px] border-[#e5e7eb] justify-start gap-2 bg-transparent text-sm sm:text-base"
                >
                  <FileText className="w-4 h-4" />
                  Generate Report
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
              {lowStockItems.map((item: any, index: number) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-[#fef2f2]"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-xl sm:text-2xl">💊</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#111827] text-sm sm:text-base">{item.name}</p>
                      <p className="text-xs sm:text-sm text-[#6b7280]">
                        Only {item.totalStock} {item.unit} left
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="text-white bg-[#dc2626] w-full sm:w-auto text-xs sm:text-sm">
                    Reorder
                  </Button>
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
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {expiringItems.map((batch: any, index: number) => {
                const daysToExpiry = Math.ceil(
                  (new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                )
                const bgColor =
                  daysToExpiry <= 5 ? "bg-[#fef2f2]" : daysToExpiry <= 15 ? "bg-[#fff7ed]" : "bg-[#fefce8]"
                const buttonColor =
                  daysToExpiry <= 5 ? "bg-[#dc2626]" : daysToExpiry <= 15 ? "bg-[#ea580c]" : "bg-[#ca8a04]"
                const buttonText = daysToExpiry <= 5 ? "Mark Return" : daysToExpiry <= 15 ? "Discount Sale" : "Monitor"

                return (
                  <div
                    key={batch.id}
                    className={cn(
                      "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg",
                      bgColor,
                    )}
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className="text-xl sm:text-2xl">💊</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#111827] text-sm sm:text-base">{batch.product.name}</p>
                        <p className="text-xs sm:text-sm text-[#6b7280]">Expires in {daysToExpiry} days</p>
                      </div>
                    </div>
                    <Button size="sm" className={cn("text-white w-full sm:w-auto text-xs sm:text-sm", buttonColor)}>
                      {buttonText}
                    </Button>
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
