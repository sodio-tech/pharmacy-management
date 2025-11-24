"use client"

import { TrendingUp, TrendingDown, AlertTriangle, Clock, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatPercentage } from "@/lib/utils"

interface SalesAnalytics {
  today_transactions: number
  transactions_change_percent: number
  this_month_earnings: number
  this_month_earnings_change_percent: number
}

interface KPICardsProps {
  salesAnalytics: SalesAnalytics | null
  lowStockCount: number
}

export function KPICards({ salesAnalytics, lowStockCount }: KPICardsProps) {
  const kpiCards = [
    {
      title: "Total Revenue",
      value: `₹${(salesAnalytics?.this_month_earnings || 0).toLocaleString()}`,
      change: `${formatPercentage(salesAnalytics?.this_month_earnings_change_percent || 0)} vs last month`,
      trend: (salesAnalytics?.this_month_earnings_change_percent || 0) >= 0 ? "up" : "down",
      icon: "₹",
      color: "bg-[#16a34a]",
    },
    {
      title: "Orders",
      value: (salesAnalytics?.today_transactions || 0).toString(),
      change: `${formatPercentage(salesAnalytics?.transactions_change_percent || 0)} vs previous month`,
      trend: (salesAnalytics?.transactions_change_percent || 0) >= 0 ? "up" : "down",
      icon: ShoppingCart,
      color: "bg-[#2563eb]",
    },
    {
      title: "Low Stock Items",
      value: lowStockCount.toString(),
      change: "Requires attention",
      trend: "warning",
      icon: AlertTriangle,
      color: "bg-[#ea580c]",
    },
    {
      title: "Expiring Soon",
      value: "Coming Soon",
      change: "Feature in development",
      trend: "neutral",
      icon: Clock,
      color: "bg-[#dc2626]",
    },
  ]

  return (
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
  )
}

