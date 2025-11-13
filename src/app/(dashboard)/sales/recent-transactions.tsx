"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Receipt } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { Transaction } from "@/types/sales"

interface RecentTransactionsProps {
  branchId?: string
}

interface ApiSaleItem {
  price: number
  gst_rate: number
  quantity: number
  product_id: number
}

interface ApiSale {
  id: number
  payment_mode: string
  status: string
  total_amount: number
  created_at: string
  prescription: {
    doctor_name: string | null
    doctor_contact: string | null
    notes: string
    prescription_link: string
  }
  customer: {
    id: number
    name: string
    phone_number: string
    email: string | null
  }
  sale_items: ApiSaleItem[]
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    sales: ApiSale[]
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export function RecentTransactions({ branchId }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec${diffInSeconds !== 1 ? 's' : ''} ago`
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`
    }
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    }
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  }

  const mapApiSaleToTransaction = useCallback((sale: ApiSale): Transaction => {
    const totalItems = sale.sale_items.reduce((sum, item) => sum + item.quantity, 0)
    // Map API status to UI status
    let status = sale.status.toUpperCase()
    if (status === 'PAID') {
      status = 'COMPLETED'
    }
    return {
      id: `${sale.id}`,
      customer: sale.customer.name || 'Walk-in Customer',
      items: totalItems,
      amount: sale.total_amount,
      time: formatTimeAgo(sale.created_at),
      status: status,
    }
  }, [])

  const fetchTransactions = useCallback(async () => {
    if (!branchId) {
      setTransactions([])
      return
    }

    try {
      setLoading(true)
      const response = await backendApi.get<ApiResponse>(`/v1/sales/list/${branchId}?page=1&limit=2`)
      const data = response.data?.data

      if (data?.sales) {
        const mappedTransactions = data.sales.map(mapApiSaleToTransaction)
        setTransactions(mappedTransactions)
      } else {
        setTransactions([])
      }
    } catch (error: unknown) {
      console.error('Error fetching recent transactions:', error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [branchId, mapApiSaleToTransaction])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

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
                  <p className="font-medium">Sale ID: {transaction.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.customer} • {transaction.items} items
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{transaction.amount.toLocaleString('en-IN')}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.time}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
