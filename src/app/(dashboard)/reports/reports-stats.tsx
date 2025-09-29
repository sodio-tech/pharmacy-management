import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, DollarSign, Percent } from "lucide-react"

export function ReportsStats() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹12.5L",
      change: "+18.2% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: "2,847",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Order Value",
      value: "₹439",
      change: "+5.1% from last month",
      changeType: "positive" as const,
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
  )
}
