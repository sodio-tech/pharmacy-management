"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Printer, X, Clock, User, Package, CheckCircle, AlertCircle } from 'lucide-react'
import { backendApi } from "@/lib/axios-config"

interface OrderDetails {
  id: number
  invoice_id: string
  payment_mode: string
  status: string
  total_amount: number
  created_at: string
  customer: {
    name: string
    phone_number: string
    email?: string
  }
  sale_items: Array<{
    price: number
    gst_rate: number
    quantity: number
    product_id: number
    product: {
      name: string
    }
  }>
}

interface OrderDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  branchId?: string
}

export function OrderDetailsSheet({
  open,
  onOpenChange,
  orderId,
  branchId,
}: OrderDetailsSheetProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && orderId && branchId) {
      fetchOrderDetails()
    }
  }, [open, orderId, branchId])

  const getSampleOrderDetails = (): OrderDetails => {
    return {
      id: parseInt(orderId) || 1,
      invoice_id: orderId || "INV-001",
      payment_mode: "CASH",
      status: "PAID",
      total_amount: 1250.00,
      created_at: new Date().toISOString(),
      customer: {
        name: "John Doe",
        phone_number: "+91 98765 43210",
        email: "john.doe@example.com",
      },
      sale_items: [
        {
          price: 500.00,
          gst_rate: 5,
          quantity: 2,
          product_id: 1,
          product: {
            name: "Paracetamol 500mg",
          },
        },
        {
          price: 150.00,
          gst_rate: 5,
          quantity: 1,
          product_id: 2,
          product: {
            name: "Cough Syrup 100ml",
          },
        },
        {
          price: 50.00,
          gst_rate: 5,
          quantity: 1,
          product_id: 3,
          product: {
            name: "Bandage",
          },
        },
      ],
    }
  }

  const fetchOrderDetails = async () => {
    if (!branchId || !orderId) return

    try {
      setLoading(true)
      const response = await backendApi.get(`/v1/sales/${orderId}?branch_id=${branchId}`)
      if (response.data?.success) {
        setOrderDetails(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
      // Use sample data when API is not ready
      setOrderDetails(getSampleOrderDetails())
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateSubtotal = () => {
    if (!orderDetails?.sale_items) return 0
    return orderDetails.sale_items.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
  }

  const calculateTax = (rate: number) => {
    const subtotal = calculateSubtotal()
    return (subtotal * rate) / 100
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
      case "COMPLETED":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200"
      case "CANCELLED":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />
      case "PENDING":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Loading Order Details</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading order details...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  if (!orderDetails) {
    return null
  }

  const subtotal = calculateSubtotal()
  const sgst = calculateTax(2.5)
  const cgst = calculateTax(2.5)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <SheetTitle className="text-xl font-bold">
                  Order #{orderDetails.invoice_id}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(orderDetails.created_at)}</span>
                </div>
              </div>
              <Badge className={`${getStatusColor(orderDetails.status)} flex items-center gap-1.5 px-3 py-1`}>
                {getStatusIcon(orderDetails.status)}
                {orderDetails.status.toUpperCase()}
              </Badge>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Customer Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Customer Details
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{orderDetails.customer.name}</span>
                </div>
                <div className="text-sm text-muted-foreground pl-6">
                  {orderDetails.customer.phone_number}
                </div>
                {orderDetails.customer.email && (
                  <div className="text-sm text-muted-foreground pl-6">
                    {orderDetails.customer.email}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Order Items
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                        Item Name
                      </th>
                      <th className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground px-2 py-3">
                        Qty
                      </th>
                      <th className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground px-2 py-3">
                        Price
                      </th>
                      <th className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orderDetails.sale_items.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm font-medium">{item.product.name}</td>
                        <td className="px-2 py-3 text-sm text-center">{item.quantity}</td>
                        <td className="px-2 py-3 text-sm text-right">
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Bill Summary */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Bill Summary
              </h3>
              <div className="space-y-2 bg-muted/30 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sub Total</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SGST (2.5%)</span>
                  <span className="font-medium">₹{sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CGST (2.5%)</span>
                  <span className="font-medium">₹{cgst.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{orderDetails.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Payment Details
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-semibold">{orderDetails.payment_mode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-green-600">
                    ₹{orderDetails.total_amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">{formatDate(orderDetails.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t bg-muted/30 px-6 py-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
