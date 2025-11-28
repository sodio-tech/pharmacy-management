"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, Plus, Minus, User, FileText, Image as ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/CartContext"
import { toast } from "react-toastify"
import { CustomerModal } from "./customer-modal"
import { PrescriptionModal } from "./prescription-modal"
import { OrderDetailsSheet } from "./order-details-sheet"
import type { Customer } from "@/types/sales"
import { usePaymentModes } from "@/hooks/usePaymentModes"
import { backendApi } from "@/lib/axios-config"

interface Prescription {
  prescription?: File
  prescription_notes?: string
  doctor_name?: string
  doctor_contact?: string
}

interface CurrentSaleSidebarProps {
  branchId?: number | string | null
}

export function CurrentSaleSidebar({ branchId }: CurrentSaleSidebarProps) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updatePackSize,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getCartTax,
    getCartDiscount,
    getItemCount,
    processCheckout,
    isProcessing,
    isCalculatingPrices,
    setCustomerId,
  } = useCart()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [selectedPaymentModeId, setSelectedPaymentModeId] = useState<number | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [prescriptionImageUrl, setPrescriptionImageUrl] = useState<string | null>(null)
  const [completedSaleId, setCompletedSaleId] = useState<string | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)

  const { paymentMethods, isLoading: isLoadingPaymentModes } = usePaymentModes()

  const subtotal = getCartSubtotal()
  const tax = getCartTax()
  const total = getCartTotal()
  const itemCount = getItemCount()

  // Set default payment method when payment modes are loaded
  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      // Prefer CASH if available, otherwise use first payment method
      const cashMethod = paymentMethods.find(m => m.value === "CASH")
      const defaultMethod = cashMethod || paymentMethods[0]
      setSelectedPaymentMethod(defaultMethod.value)
      setSelectedPaymentModeId(defaultMethod.id)
    }
  }, [paymentMethods, selectedPaymentMethod])

  // Update payment mode ID when payment method changes
  useEffect(() => {
    if (selectedPaymentMethod && paymentMethods.length > 0) {
      const method = paymentMethods.find(m => m.value === selectedPaymentMethod)
      if (method) {
        setSelectedPaymentModeId(method.id)
      }
    }
  }, [selectedPaymentMethod, paymentMethods])

  // Cleanup image URL on unmount
  useEffect(() => {
    return () => {
      if (prescriptionImageUrl) {
        URL.revokeObjectURL(prescriptionImageUrl)
      }
    }
  }, [prescriptionImageUrl])

  const handleSaveCustomer = (customerData: Customer) => {
    setCustomer(customerData)
    // Update customer ID in cart context for pricing API
    setCustomerId(customerData.id || null)
  }

  const handleEditCustomer = () => {
    setIsCustomerModalOpen(true)
  }

  const handleCreateCustomer = () => {
    setIsCustomerModalOpen(true)
  }

  const handleSavePrescription = (prescriptionData: Prescription) => {
    setPrescription(prescriptionData)
    // Create preview URL if file exists
    if (prescriptionData.prescription) {
      const url = URL.createObjectURL(prescriptionData.prescription)
      setPrescriptionImageUrl(url)
    } else {
      setPrescriptionImageUrl(null)
    }
  }

  const handleViewPrescriptionImage = () => {
    if (prescription?.prescription) {
      if (!prescriptionImageUrl) {
        const url = URL.createObjectURL(prescription.prescription)
        setPrescriptionImageUrl(url)
      }
      setIsImagePreviewOpen(true)
    }
  }

  const handleAddPrescription = () => {
    // Allow editing if prescription already exists, but require customer for new prescription
    if (!prescription && !customer) {
      toast.error("Please add customer details first before adding prescription")
      return
    }
    setIsPrescriptionModalOpen(true)
  }

  const handleCompleteSale = async () => {
    if (!branchId) {
      toast.error("Please select a branch")
      return
    }

    if (!selectedPaymentModeId) {
      toast.error("Please select a payment method")
      return
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty")
      return
    }

    setIsCompleting(true)
    try {
      const formData = new FormData()
      // Add customer_id only if customer exists
      if (customer?.id) {
        formData.append("customer_id", String(customer.id))
      }
      formData.append("branch_id", branchId.toString())
      formData.append("payment_mode", String(selectedPaymentModeId))

      // Format cart items according to API requirements
      const cartItemsData = cartItems.map(item => ({
        product_id: Number(item.product.id),
        quantity: item.quantity,
        pack_size: item.packSize,
      }))
      formData.append("cart", JSON.stringify(cartItemsData))

      // Add prescription data if available
      if (prescription?.prescription) {
        formData.append("prescription", prescription.prescription)
      }
      if (prescription?.prescription_notes) {
        formData.append("prescription_notes", prescription.prescription_notes)
      }
      if (prescription?.doctor_name) {
        formData.append("doctor_name", prescription.doctor_name)
      }
      if (prescription?.doctor_contact) {
        formData.append("doctor_contact", prescription.doctor_contact)
      }

      const response = await backendApi.post("/v1/sales/new-sale?action=paid", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      const responseData = response.data
      if (responseData?.success) {
        toast.success("Sale completed successfully!")
        
        // Get sale_id from response and open order details sheet
        const saleId = responseData?.data?.sale_id
        if (saleId) {
          setCompletedSaleId(String(saleId))
          setIsOrderDetailsOpen(true)
        }
        
        setCustomer(null)
        setPrescription(null)
        setCustomerId(null)
        clearCart(true)
        
        // Reload the page after 3.5 seconds
        setTimeout(() => {
          window.location.reload()
        }, 3500)
      } else {
        toast.error(responseData?.message || "Failed to complete sale")
      }
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message
      toast.error(errorMessage || "Failed to complete sale")
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="w-full bg-background rounded-xl">
      <Card className="h-full rounded-xl">
        <CardHeader className="border-b px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg md:text-xl">Current Sale</CardTitle>
              <div className="space-y-1">
                {itemCount > 0 && (
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
                  </p>
                )}
                {customer && <p className="text-xs md:text-sm text-teal-600 font-medium">Customer: {customer.patient_name}</p>}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => clearCart()}>
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Customer Info */}
          <div className="p-3 md:p-4 rounded-lg bg-muted/50">
            {customer ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Avatar className="h-10 w-10 md:h-12 md:w-12">
                      <AvatarFallback>
                        {customer.patient_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm md:text-base">{customer.patient_name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{customer.patient_phone}</p>
                      {customer.patient_email && (
                        <p className="text-xs text-muted-foreground hidden md:block">{customer.patient_email}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 hover:text-teal-700 text-xs md:text-sm"
                    onClick={handleEditCustomer}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-3 md:py-4">
                <div className="flex flex-col items-center space-y-2 md:space-y-3">
                  <div className="p-2 md:p-3 rounded-full bg-muted">
                    <User className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">No customer selected</p>
                    <p className="text-xs text-muted-foreground">Optional: Add customer information</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateCustomer}
                    className="text-teal-600 hover:text-teal-700 border-teal-200 bg-transparent"
                  >
                    <User className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    Select Customer
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Prescription Section - Only show when customer is selected */}
          {customer && (
            <div className="p-3 md:p-4 rounded-lg bg-muted/50 border border-dashed border-border">
              {prescription &&
                (prescription.prescription || prescription.doctor_name || prescription.prescription_notes) ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="p-2 md:p-3 rounded-full bg-teal-100 dark:bg-teal-900">
                        <FileText className="h-5 w-5 md:h-6 md:w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm md:text-base">Prescription Added</p>
                        {prescription.doctor_name && (
                          <p className="text-xs md:text-sm text-muted-foreground">{prescription.doctor_name}</p>
                        )}
                        {prescription.prescription && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 p-0 h-auto mt-1"
                            onClick={handleViewPrescriptionImage}
                          >
                            <ImageIcon className="h-3 w-3 mr-1" />
                            View Image
                          </Button>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-teal-600 hover:text-teal-700 text-xs md:text-sm"
                      onClick={handleAddPrescription}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 md:py-4">
                  <div className="flex flex-col items-center space-y-2 md:space-y-3">
                    <div className="p-2 md:p-3 rounded-full bg-muted">
                      <FileText className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">No prescription added</p>
                      <p className="text-xs text-muted-foreground">Optional: Add prescription details</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddPrescription}
                      className="text-teal-600 hover:text-teal-700 border-teal-200 bg-transparent"
                    >
                      <FileText className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      Add Prescription
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items */}
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
                Cart Items
              </p>
              {cartItems.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearCart()}
                  className="text-red-600 hover:text-red-700 text-xs h-7"
                >
                  Clear All
                </Button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-muted-foreground">
                <p className="text-xs md:text-sm">No items in cart</p>
                <p className="text-xs">Add products to get started</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-2 md:space-x-3 p-3 md:p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="p-2 md:p-3 rounded-lg bg-muted flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={item.product.image_url || "/assets/fallback.jpg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/assets/fallback.jpg"
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <p className="font-semibold text-xs md:text-sm mb-1 line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground mb-2 md:mb-3">
                      {item.product.unit_of_measure} • ₹{Number(item.unitPrice).toFixed(2)} each
                    </p>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center w-full justify-between">
                        <div className="flex items-center w-full space-x-1 md:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 md:h-8 md:w-8 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs md:text-sm font-semibold w-6 md:w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 md:h-8 md:w-8 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right pl-4 w-full">
                          <p className="font-bold text-sm md:text-base">
                            ₹{(() => {
                              // Calculate total price without GST for this item
                              // listPrice is unit price without GST, so multiply by quantity and packSize
                              if (item.listPrice !== undefined && item.listPrice > 0) {
                                const totalWithoutGst = item.listPrice * item.quantity * item.packSize
                                return Number(totalWithoutGst).toFixed(2)
                              }
                              // If API price is available, calculate price without GST
                              if (item.apiPrice !== undefined && item.gstRate !== undefined) {
                                const priceWithoutGst = item.apiPrice / (1 + item.gstRate / 100)
                                return Number(priceWithoutGst).toFixed(2)
                              }
                              // Fallback to totalPrice if API price not loaded yet
                              return Number(item.totalPrice || 0).toFixed(2)
                            })()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-muted-foreground whitespace-nowrap">Pack Size:</label>
                        <Input
                          type="number"
                          min="1"
                          max={item.product.pack_size && item.product.pack_size > 0 ? item.product.pack_size : 1}
                          value={item.packSize}
                          onChange={(e) => {
                            const defaultPackSize = item.product.pack_size && item.product.pack_size > 0 ? item.product.pack_size : 1
                            const inputValue = parseInt(e.target.value) || 1
                            const newPackSize = Math.max(1, Math.min(inputValue, defaultPackSize))
                            updatePackSize(item.id, newPackSize)
                          }}
                          className="h-7 w-20 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 md:p-2"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Bill Summary */}
          <div className="space-y-3 md:space-y-4 pt-3 md:pt-4 border-t-2">
            <p className="font-semibold text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Bill Summary</p>
            <div className="space-y-2 md:space-y-3">
              {isCalculatingPrices && (
                <div className="text-xs text-muted-foreground text-center">
                  Calculating prices...
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {isCalculatingPrices ? "..." : `₹${Number(subtotal).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-muted-foreground">GST</span>
                  <span className="font-medium">
                    {isCalculatingPrices ? "..." : `₹${Number(tax).toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg md:text-xl">
                    <span>Total</span>
                    <span className="text-teal-600">
                      {isCalculatingPrices ? "..." : `₹${Number(total).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2 md:space-y-3">
            <p className="font-semibold text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
              Payment Method
            </p>
            {isLoadingPaymentModes ? (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-xs md:text-sm">Loading payment methods...</p>
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-xs md:text-sm">No payment methods available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const isActive = selectedPaymentMethod === method.value
                  return (
                    <Button
                      key={method.id}
                      variant={isActive ? "default" : "outline"}
                      className={`h-16 md:h-20 flex-col space-y-1 md:space-y-2 ${isActive ? "bg-teal-600 hover:bg-teal-700" : ""}`}
                      onClick={() => {
                        setSelectedPaymentMethod(method.value)
                        setSelectedPaymentModeId(method.id)
                      }}
                    >
                      <Icon className="h-5 w-5 md:h-6 md:w-6" />
                      <span className="text-xs md:text-sm font-medium">{method.name}</span>
                    </Button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 md:space-y-3 pt-2">
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 h-12 md:h-14 text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              disabled={cartItems.length === 0 || isCompleting || !branchId}
              onClick={handleCompleteSale}
            >
              {isCompleting ? "Processing..." : `Complete Sale - ₹${Number(total).toFixed(2)}`}
            </Button>
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              <Button
                variant="outline"
                className="h-9 md:h-11 text-sm bg-transparent"
                onClick={() => clearCart()}
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        existingCustomer={customer}
      />
      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSave={handleSavePrescription}
        existingPrescription={prescription}
      />

      {/* Image Preview Dialog */}
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogTitle className="sr-only">Prescription Image Preview</DialogTitle>
          {prescriptionImageUrl && (
            <div className="relative w-full h-full">
              <img
                src={prescriptionImageUrl}
                alt="Prescription"
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setIsImagePreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Details Sheet - Opens when new sale is completed */}
      {completedSaleId && (
        <OrderDetailsSheet
          open={isOrderDetailsOpen}
          onOpenChange={setIsOrderDetailsOpen}
          orderId={completedSaleId}
          branchId={branchId}
        />
      )}
    </div>
  )
}
