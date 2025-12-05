"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { backendApi } from "@/lib/axios-config"

interface TrendData {
  [key: string]: {
    total_sales: number
    total_amount: number
    date?: string
  }
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    trend: TrendData
    timeframe: string
  }
}

interface ChartDataPoint {
  label: string
  amount: number
  sales: number
  date?: string
}

interface SalesTrendChartProps {
  branchId: number | null
}

export function SalesTrendChart({ branchId }: SalesTrendChartProps) {
  const [activeTab, setActiveTab] = useState<"Daily" | "Weekly" | "Monthly">("Daily")
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Generate labels based on timeframe and number of periods
  const generateLabels = (timeframe: "Daily" | "Weekly" | "Monthly", numPeriods: number): string[] => {
    const labels: string[] = []
    const now = new Date()

    if (timeframe === "Daily") {
      // Last 7 days including today
      for (let i = numPeriods - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dayName = date.toLocaleDateString("en-IN", { weekday: "short" })
        labels.push(dayName)
      }
    } else if (timeframe === "Weekly") {
      // Generate Week 1, Week 2, etc. based on actual number of weeks
      for (let i = 0; i < numPeriods; i++) {
        labels.push(`Week ${i + 1}`)
      }
    } else {
      // Last 6 months including current month
      for (let i = numPeriods - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        const monthName = date.toLocaleDateString("en-IN", { month: "short" })
        labels.push(monthName)
      }
    }

    return labels
  }

  // Transform API response to chart data format
  const transformData = (
    trendData: TrendData,
    timeframe: "Daily" | "Weekly" | "Monthly"
  ): ChartDataPoint[] => {
    const dataPoints: ChartDataPoint[] = []

    // Sort keys numerically (1, 2, 3, ...)
    const keys = Object.keys(trendData).sort((a, b) => Number(a) - Number(b))
    const numPeriods = keys.length

    // Create data points for each period returned by API
    keys.forEach((key, index) => {
      const periodData = trendData[key] || { total_sales: 0, total_amount: 0 }
      
      let label: string
      
      // For Daily timeframe, use the date from API response if available
      if (timeframe === "Daily" && periodData.date) {
        const date = new Date(periodData.date)
        // Format as "DD MMM" (e.g., "24 Nov")
        label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      } else if (timeframe === "Weekly" && periodData.date) {
        // For Weekly, show date range or week info
        const date = new Date(periodData.date)
        label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      } else if (timeframe === "Monthly" && periodData.date) {
        // For Monthly, show month and year
        const date = new Date(periodData.date)
        label = date.toLocaleDateString("en-IN", { month: "short", year: "numeric" })
      } else {
        // Generate labels for Weekly/Monthly or fallback for Daily
        const labels = generateLabels(timeframe, numPeriods)
        label = labels[index] || `Period ${key}`
      }
      
      dataPoints.push({
        label,
        amount: periodData.total_amount || 0,
        sales: periodData.total_sales || 0,
        date: periodData.date,
      })
    })

    return dataPoints
  }

  const fetchSalesTrend = useCallback(async () => {
    if (!branchId) {
      setChartData([])
      return
    }

    try {
      setIsLoading(true)
      const timeframe = activeTab.toLowerCase()
      const response = await backendApi.get<ApiResponse>(
        `/v1/reports/sales-trend?timeframe=${timeframe}&branch_id=${branchId}`
      )

      if (response.data?.success && response.data?.data?.trend) {
        const transformedData = transformData(response.data.data.trend, activeTab)
        setChartData(transformedData)
      } else {
        setChartData([])
      }
    } catch (error) {
      setChartData([])
    } finally {
      setIsLoading(false)
    }
  }, [branchId, activeTab])

  useEffect(() => {
    fetchSalesTrend()
  }, [fetchSalesTrend])

  const handleTabChange = (tab: "Daily" | "Weekly" | "Monthly") => {
    setActiveTab(tab)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales Trend</CardTitle>
        <div className="flex space-x-2">
          {(["Daily", "Weekly", "Monthly"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              onClick={() => handleTabChange(tab)}
              className={activeTab === tab ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              {tab}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading chart data...</div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">
                {branchId ? "No data available" : "Select a branch to view sales trend"}
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "amount") {
                      return [`₹${value.toLocaleString("en-IN")}`, "Amount"]
                    }
                    return [value, "Sales"]
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0] && payload[0].payload?.date) {
                      const date = new Date(payload[0].payload.date)
                      const formattedDate = date.toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })
                      return formattedDate
                    }
                    return `Period: ${label}`
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#0d9488"
                  strokeWidth={2}
                  name="Sales Amount"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
