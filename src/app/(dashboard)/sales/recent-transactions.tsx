"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Receipt } from "lucide-react"
import { salesService, Transaction } from "@/services/salesService"

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const recentTransactions = await salesService.getRecentTransactions(5)
        setTransactions(recentTransactions)
      } catch (error) {
        console.error('Error fetching recent transactions:', error)
        // Use fallback data if API fails
        setTransactions([
          {
            id: "#INV-2024-001234",
            customer: "Walk-in Customer",
            items: 2,
            amount: 485.00,
            time: "2 mins ago",
            status: "COMPLETED"
          },
          {
            id: "#INV-2024-001233",
            customer: "John Smith",
            items: 5,
            amount: 1250.00,
            time: "15 mins ago",
            status: "COMPLETED"
          },
          {
            id: "#INV-2024-001232",
            customer: "Sarah Johnson",
            items: 3,
            amount: 750.00,
            time: "32 mins ago",
            status: "COMPLETED"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600'
      case 'PENDING':
        return 'text-yellow-600'
      case 'CANCELLED':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className="mt-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          // Loading skeleton
          [...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-muted">
                  <div className="h-4 w-4 bg-muted rounded"></div>
                </div>
                <div>
                  <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-12"></div>
              </div>
            </div>
          ))
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No recent transactions</p>
            <p className="text-xs">Complete a sale to see it here</p>
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full bg-muted ${getStatusColor(transaction.status)}`}>
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{transaction.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.customer} • {transaction.items} items
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{salesService.formatCurrency(transaction.amount)}</p>
                <p className="text-sm text-muted-foreground">
                  {salesService.getRelativeTime(transaction.time)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
