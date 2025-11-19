"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"

interface TransactionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branchId?: number | string | null
}

interface ApiSaleItem {
  price: number
  gst_rate: number
  quantity: number
  product_id: number
}

interface ApiSale {
  id: number
  invoice_id: string
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

export function TransactionsModal({ open, onOpenChange, branchId }: TransactionsModalProps) {
  const [transactions, setTransactions] = useState<ApiSale[]>([])
  const [loading, setLoading] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const itemsPerPage = 10

  const fetchTransactions = async (page: number) => {
    if (!branchId) return

    try {
      setLoading(true)
      let url = `/v1/sales/list/${branchId.toString()}?page=${page}&limit=${itemsPerPage}`
      
      if (startDate) {
        url += `&start_date=${startDate}`
      }
      if (endDate) {
        url += `&end_date=${endDate}`
      }

      const response = await backendApi.get<ApiResponse>(url)
      const data = response.data?.data

      if (data?.sales) {
        setTransactions(data.sales)
        setTotalPages(data.total_pages)
      } else {
        setTransactions([])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && branchId) {
      fetchTransactions(currentPage)
    }
  }, [open, branchId, currentPage, startDate, endDate])

  const handleDownloadInvoice = async (saleId: number, invoiceId?: string) => {
    if (!saleId || !branchId) {
      return
    }

    try {
      setPrinting(true)
      const response = await backendApi.get(
        `/v1/sales/generate-reciept/${saleId}?branch_id=${branchId.toString()}`,
        {
          responseType: 'blob',
        }
      )

      // Create blob from response data
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      
      // Create download link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${invoiceId || saleId}.pdf`)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      // Clean up the URL
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 100)
      
    } catch (error) {
      toast.error("Receipt generate failed")
    } finally {
      setPrinting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
      case 'COMPLETED':
        return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400'
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400'
    }
  }

  const handleApplyFilters = () => {
    setCurrentPage(1)
    fetchTransactions(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Transactions</DialogTitle>
        </DialogHeader>

        {/* Date Filters */}
        <div className="flex gap-4 items-end mb-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Start Date</label>
            <div className="relative">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">End Date</label>
            <div className="relative">
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          {(startDate || endDate) && (
            <Button
              variant="outline"
              onClick={() => {
                setStartDate("")
                setEndDate("")
                setCurrentPage(1)
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Transactions Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={8}>
                      <div className="h-10 bg-muted animate-pulse rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction,index) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">#{(transaction?.invoice_id)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.customer.name || 'Walk-in Customer'}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.customer.phone_number || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell>
                      {transaction.sale_items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </TableCell>
                    <TableCell className="uppercase text-sm">
                      {transaction.payment_mode}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{transaction.total_amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(transaction.id, transaction.invoice_id)}
                        disabled={printing}
                        title="Download Invoice"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
