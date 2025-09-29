import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, DollarSign, Wallet } from "lucide-react"

export function SalesStats() {
  const stats = [
    {
      title: "Today's Sales",
      value: "₹45,280",
      change: "+12% from yesterday",
      changeType: "positive" as "positive" | "negative" | "neutral",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Transactions",
      value: "127",
      change: "+8 from yesterday",
      changeType: "positive" as const,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Avg. Sale",
      value: "₹356",
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
      {stats.map((stat, index) => {
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
