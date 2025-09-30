import { Plus, Upload, Package, FileText, TrendingUp, AlertTriangle, Clock, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

const kpiCards = [
  {
    title: "Total Revenue",
    value: "₹2,45,680",
    change: "12.5% vs last month",
    trend: "up",
    icon: "₹",
    color: "bg-[#16a34a]",
  },
  {
    title: "Orders Today",
    value: "156",
    change: "8.2% vs yesterday",
    trend: "up",
    icon: ShoppingCart,
    color: "bg-[#2563eb]",
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "Requires attention",
    trend: "warning",
    icon: AlertTriangle,
    color: "bg-[#ea580c]",
  },
  {
    title: "Expiring Soon",
    value: "8",
    change: "Within 30 days",
    trend: "danger",
    icon: Clock,
    color: "bg-[#dc2626]",
  },
]

const recentPrescriptions = [
  {
    id: "PRX-2024-001",
    patient: "John Smith",
    amount: "₹1,250",
    items: "2 items",
    status: "Completed",
    statusColor: "bg-[#dcfce7] text-[#166534]",
    iconColor: "bg-[#0f766e]",
  },
  {
    id: "PRX-2024-002",
    patient: "Maria Garcia",
    amount: "₹890",
    items: "3 items",
    status: "Processing",
    statusColor: "bg-[#fef9c3] text-[#854d0e]",
    iconColor: "bg-[#ea580c]",
  },
  {
    id: "PRX-2024-003",
    patient: "David Johnson",
    amount: "₹2,100",
    items: "5 items",
    status: "Pending",
    statusColor: "bg-[#dbeafe] text-[#1e40af]",
    iconColor: "bg-[#2563eb]",
  },
]

const lowStockItems = [
  {
    name: "Paracetamol 500mg",
    stock: "Only 5 left",
    icon: "💊",
    bgColor: "bg-[#fef2f2]",
    buttonColor: "bg-[#dc2626]",
  },
  {
    name: "Amoxicillin 250mg",
    stock: "12 left",
    icon: "💊",
    bgColor: "bg-[#fff7ed]",
    buttonColor: "bg-[#ea580c]",
  },
  {
    name: "Ibuprofen 400mg",
    stock: "18 left",
    icon: "💊",
    bgColor: "bg-[#fefce8]",
    buttonColor: "bg-[#ca8a04]",
  },
]

const expiryItems = [
  {
    name: "Cough Syrup",
    expiry: "Expires in 5 days",
    icon: "💊",
    bgColor: "bg-[#fef2f2]",
    buttonColor: "bg-[#dc2626]",
    buttonText: "Mark Return",
  },
  {
    name: "Vitamin D3",
    expiry: "Expires in 15 days",
    icon: "💊",
    bgColor: "bg-[#fff7ed]",
    buttonColor: "bg-[#ea580c]",
    buttonText: "Discount Sale",
  },
  {
    name: "Multivitamin",
    expiry: "Expires in 28 days",
    icon: "💊",
    bgColor: "bg-[#fefce8]",
    buttonColor: "bg-[#ca8a04]",
    buttonText: "Monitor",
  },
]

export function DashboardContent() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await api.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  const kpis = dashboardData?.kpis || {};
  const recentPrescriptions = dashboardData?.recentPrescriptions || [];
  const lowStockItems = kpis.lowStockItems?.items || [];
  const expiringItems = kpis.expiringItems?.batches || [];

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
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => (
          <Card key={index} className="bg-white border-[#e5e7eb] py-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", card.color)}>
                  {typeof card.icon === "string" ? (
                    <span className="text-white text-xl font-bold">{card.icon}</span>
                  ) : (
                    <card.icon className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-[#6b7280] mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-[#111827] mb-2">{card.value}</p>
                <div className="flex items-center gap-1">
                  {card.trend === "up" && <TrendingUp className="w-4 h-4 text-[#16a34a]" />}
                  {card.trend === "warning" && <AlertTriangle className="w-4 h-4 text-[#ea580c]" />}
                  {card.trend === "danger" && <Clock className="w-4 h-4 text-[#dc2626]" />}
                  <span
                    className={cn(
                      "text-sm",
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Prescriptions */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-[#e5e7eb] h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-[#111827]">Recent Prescriptions</CardTitle>
              <Button variant="ghost" className="text-[#0f766e] hover:text-[#0f766e]/80">
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <div className="space-y-4">
                {recentPrescriptions.map((prescription, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn("w-12 h-12 rounded-lg flex items-center justify-center", prescription.iconColor)}
                      >
                        <span className="text-white font-bold">Rx</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#111827]">{prescription.id}</p>
                        <p className="text-sm text-[#6b7280]">Patient: {prescription.patient}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-[#111827]">{prescription.amount}</p>
                        <p className="text-sm text-[#6b7280]">{prescription.items}</p>
                      </div>
                      <Badge className={cn("px-3 py-1", prescription.statusColor)}>{prescription.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="bg-white border-[#e5e7eb] h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#111827]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <div className="space-y-3">
                <Button className="w-full h-[55px] bg-[#0f766e] hover:bg-[#0f766e]/90 text-white justify-start gap-2">
                  <Plus className="w-4 h-4" />
                  New Sale
                </Button>
                <Button className="w-full h-[55px] bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white justify-start gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Prescription
                </Button>
                <Button className="w-full h-[55px] bg-[#06b6d4] hover:bg-[#06b6d4]/90 text-white justify-start gap-2">
                  <Package className="w-4 h-4" />
                  Add Inventory
                </Button>
                <Button variant="outline" className="w-full h-[55px] border-[#e5e7eb] justify-start gap-2 bg-transparent">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Low Stock Alerts */}
        <Card className="bg-white border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-[#111827]">Low Stock Alerts</CardTitle>
            <Badge variant="secondary" className="bg-[#fef9c3] text-[#854d0e]">
              23 Items
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className={cn("flex items-center justify-between p-4 rounded-lg", item.bgColor)}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-[#111827]">{item.name}</p>
                      <p className="text-sm text-[#6b7280]">{item.stock}</p>
                    </div>
                  </div>
                  <Button size="sm" className={cn("text-white", item.buttonColor)}>
                    Reorder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expiry Tracking */}
        <Card className="bg-white border-[#e5e7eb]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-[#111827]">Expiry Tracking</CardTitle>
            <Badge variant="secondary" className="bg-[#fee2e2] text-[#991b1b]">
              8 Items
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {expiryItems.map((item, index) => (
                <div key={index} className={cn("flex items-center justify-between p-4 rounded-lg", item.bgColor)}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-[#111827]">{item.name}</p>
                      <p className="text-sm text-[#6b7280]">{item.expiry}</p>
                    </div>
                  </div>
                  <Button size="sm" className={cn("text-white", item.buttonColor)}>
                    {item.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
