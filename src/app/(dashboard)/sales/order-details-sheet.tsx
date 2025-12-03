"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Printer, X, Clock, User, Package, CheckCircle, AlertCircle } from 'lucide-react'
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"

interface OrderDetails {
  id: number
  invoice_id: string
  payment_mode: string
  status: string
  total_amount: string | number
  created_at: string
  customer: {
    id: number | null
    name: string | null
    phone_number: string | null
    email: string | null
  }
  sale_items: Array<{
    price: number
    gst_rate: number
    quantity: number
    pack_size?: number
    product_id: number
    product?: {
      id: number
      product_name: string
      unit: string
      generic_name: string | null
      sku: string
      brand_name: string | null
      description: string | null
      pack_size: number
      barcode: string | null
      image: string | null
      manufacturer: string | null
      unit_price: string | number
      selling_price: string | number
      gst_rate: number
      product_categories?: string[]
      stock: string | number
    }
  }>
}

interface OrderDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  branchId?: number | string | null
}

export function OrderDetailsSheet({
  open,
  onOpenChange,
  orderId,
  branchId,
}: OrderDetailsSheetProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    if (open && orderId && branchId) {
      fetchOrderDetails()
    }
  }, [open, orderId, branchId])

  const fetchOrderDetails = async () => {
    if (!branchId || !orderId) return
    try {
      setLoading(true)
      const response = await backendApi.get(`/v1/sales/list/${branchId.toString()}?sale_id=${orderId}`)
      if (response.data?.success && response.data?.data?.sales && response.data.data.sales.length > 0) {
        // Get the first item from the result array
        const saleData = response.data.data.sales[0]
        setOrderDetails(saleData)
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
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

  const getUnitPrice = (item: OrderDetails['sale_items'][0]) => {
    // If product has selling_price, use that as unit price
    if (item.product?.selling_price) {
      return typeof item.product.selling_price === 'string'
        ? parseFloat(item.product.selling_price)
        : item.product.selling_price
    }
    // item.price is the unit price from API
    return Number(item.price)
  }

  const getLineTotal = (item: OrderDetails['sale_items'][0]) => {
    const unitPrice = getUnitPrice(item)
    const packSize = item.pack_size || item.product?.pack_size || 1
    return unitPrice * item.quantity * packSize
  }

  const calculateSubtotal = () => {
    if (!orderDetails?.sale_items) return 0
    return orderDetails.sale_items.reduce((sum, item) => {
      return sum + getLineTotal(item)
    }, 0)
  }

  const getTotalAmount = () => {
    if (!orderDetails) return 0
    return typeof orderDetails.total_amount === 'string'
      ? parseFloat(orderDetails.total_amount)
      : orderDetails.total_amount
  }

  const calculateGST = () => {
    if (!orderDetails?.sale_items) return 0
    // Calculate GST from each item's gst_rate
    return orderDetails.sale_items.reduce((sum, item) => {
      const lineTotal = getLineTotal(item)
      const gstAmount = (lineTotal * item.gst_rate) / 100
      return sum + gstAmount
    }, 0)
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

  const handlePrint = async () => {
    if (!orderId || !branchId) {
      return
    }

    try {
      setPrinting(true)
      const response = await backendApi.get(
        `/v1/sales/generate-reciept/${orderId}?branch_id=${branchId.toString()}`,
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
      link.setAttribute('download', `invoice-${orderDetails?.invoice_id || orderId}.pdf`)
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
  const gst = calculateGST()
  const totalAmount = getTotalAmount()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <SheetTitle className="text-xl font-bold">
                  INV #{orderDetails.invoice_id}
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
                {orderDetails.customer.name ? (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{orderDetails.customer.name}</span>
                    </div>
                    {orderDetails.customer.phone_number && (
                      <div className="text-sm text-muted-foreground pl-6">
                        {orderDetails.customer.phone_number}
                      </div>
                    )}
                    {orderDetails.customer.email && (
                      <div className="text-sm text-muted-foreground pl-6">
                        {orderDetails.customer.email}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Walk-in Customer
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
                      <th className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground px-2 py-3">
                        Pack Size
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
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {item.product?.product_name || `Product #${item.product_id}`}
                            </span>
                            {item.product?.generic_name && (
                              <span className="text-xs text-muted-foreground mt-0.5">
                                {item.product.generic_name}
                              </span>
                            )}
                            {item.product?.unit && (
                              <span className="text-xs text-muted-foreground">
                                {item.product.unit} • Pack: {item.pack_size || item.product.pack_size || 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm text-center">{item.quantity}</td>
                        <td className="px-2 py-3 text-sm text-center">{item.pack_size || item?.product?.pack_size || 1}</td>
                        <td className="px-2 py-3 text-sm text-right">
                          ₹{getUnitPrice(item).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-right">
                          ₹{getLineTotal(item).toFixed(2)}
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
                  {/* <span className="font-medium">₹{subtotal.toFixed(2)}</span> */}
                  <span className="font-medium">₹{(subtotal - gst).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST</span>
                  <span className="font-medium">₹{gst.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
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
                  <span className="font-semibold">{orderDetails.payment_mode.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-green-600">
                    ₹{totalAmount.toFixed(2)}
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
                disabled={printing || !orderId}
              >
                <Printer className="h-4 w-4 mr-2" />
                {printing ? "Generating..." : "Print"}
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
