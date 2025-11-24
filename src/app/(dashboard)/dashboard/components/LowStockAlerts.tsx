"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface LowStockProduct {
  product_id: number
  product_name: string
  generic_name: string
  available_stock: number
  min_stock: number
  max_stock: number
}

interface LowStockAlertsProps {
  items: LowStockProduct[]
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  return (
    <Card className="bg-white border-[#e5e7eb]">
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-[#111827]">Low Stock Alerts</CardTitle>
        <Badge variant="secondary" className="bg-[#fef9c3] text-[#854d0e] text-xs sm:text-sm">
          {items.length} Items
        </Badge>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {items.map((item) => (
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
          {items.length === 0 && (
            <div className="text-center py-8 text-[#6b7280] text-sm sm:text-base">No low stock items</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

