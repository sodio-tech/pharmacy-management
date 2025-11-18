"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const salesData = [
  { day: "Mon", thisWeek: 45, lastWeek: 42 },
  { day: "Tue", thisWeek: 52, lastWeek: 48 },
  { day: "Wed", thisWeek: 48, lastWeek: 45 },
  { day: "Thu", thisWeek: 61, lastWeek: 58 },
  { day: "Fri", thisWeek: 58, lastWeek: 52 },
  { day: "Sat", thisWeek: 67, lastWeek: 61 },
  { day: "Sun", thisWeek: 72, lastWeek: 65 },
]

interface SalesTrendChartProps {
  branchId: number | null
}

export function SalesTrendChart({ branchId }: SalesTrendChartProps) {
  const [activeTab, setActiveTab] = useState("Daily")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales Trend</CardTitle>
        <div className="flex space-x-2">
          {["Daily", "Weekly", "Monthly"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              {tab}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="thisWeek" stroke="#0d9488" strokeWidth={2} name="This Week" />
              <Line type="monotone" dataKey="lastWeek" stroke="#06b6d4" strokeWidth={2} name="Last Week" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
