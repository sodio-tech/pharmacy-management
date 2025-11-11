"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, Plus, Minus, User, FileCheck, FileText } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { toast } from "react-toastify"
import { CustomerModal } from "./customer-modal"
import { PrescriptionModal } from "./prescription-modal"
import type { Customer } from "@/types/sales"
import { usePaymentModes } from "@/hooks/usePaymentModes"
import { backendApi } from "@/lib/axios-config"

interface ReviewData {
  products: Array<{
    id: string
    quantity: number
    pack_size: number
    price: number
    gst_rate: number
  }>
  total_amt: number
  total_before_tax: number
  status: string
}

interface Prescription {
  prescription?: File
  prescription_notes?: string
  doctor_name?: string
  doctor_contact?: string
}

interface CurrentSaleSidebarProps {
  branchId?: string
}

export function CurrentSaleSidebar({ branchId }: CurrentSaleSidebarProps) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getCartTax,
    getCartDiscount,
    getItemCount,
    processCheckout,
    isProcessing,
  } = useCart()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [selectedPaymentModeId, setSelectedPaymentModeId] = useState<number | null>(null)
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const { paymentMethods, isLoading: isLoadingPaymentModes } = usePaymentModes()

  // Use review data if available, otherwise use local calculation
  const subtotal = reviewData ? reviewData.total_before_tax : getCartSubtotal()
  const total = reviewData ? reviewData.total_before_tax : getCartSubtotal()
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

  // Clear review data when cart items change (user modified cart after review)
  useEffect(() => {
    if (reviewData && cartItems.length > 0) {
      // Check if cart has changed by comparing item count or IDs
      const currentCartIds = cartItems.map(item => `${item.id}-${item.quantity}`).sort().join(',')
      const reviewProductIds = reviewData.products.map(p => `${p.id}-${p.quantity}`).sort().join(',')
      
      if (currentCartIds !== reviewProductIds) {
        setReviewData(null)
      }
    }
  }, [cartItems, reviewData])

  const handleSaveCustomer = (customerData: Customer) => {
    setCustomer(customerData)
  }

  const handleEditCustomer = () => {
    setIsCustomerModalOpen(true)
  }

  const handleCreateCustomer = () => {
    setIsCustomerModalOpen(true)
  }

  const handleSavePrescription = (prescriptionData: Prescription) => {
    setPrescription(prescriptionData)
  }

  const handleAddPrescription = () => {
    setIsPrescriptionModalOpen(true)
  }

  const handleReviewSale = async () => {
    if (!customer || !customer.id) {
      toast.error("Please add customer information before reviewing the sale")
      return
    }

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

    setIsReviewing(true)
    try {
      const formData = new FormData()
      formData.append("customer_id", String(customer.id))
      formData.append("branch_id", branchId)
      formData.append("payment_mode", String(selectedPaymentModeId))
      
      // Format cart items according to API requirements
      const cartItemsData = cartItems.map(item => ({
        product_id: Number(item.product.id),
        quantity: item.quantity,
      }))
      formData.append("cart", JSON.stringify(cartItemsData))

      const response = await backendApi.post("/v1/sales/new-sale?action=review", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      const responseData = response.data?.data || response.data
      if (responseData) {
        setReviewData(responseData)
        toast.success("Sale reviewed successfully")
      }
    } catch (error: unknown) {
      console.error("Error reviewing sale:", error)
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message
      toast.error(errorMessage || "Failed to review sale")
    } finally {
      setIsReviewing(false)
    }
  }

  const handleCompleteSale = async () => {
    if (!customer || !customer.id) {
      toast.error("Please add customer information before completing the sale")
      return
    }

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
      formData.append("customer_id", String(customer.id))
      formData.append("branch_id", branchId)
      formData.append("payment_mode", String(selectedPaymentModeId))
      
      // Format cart items according to API requirements
      const cartItemsData = cartItems.map(item => ({
        product_id: Number(item.product.id),
        quantity: item.quantity,
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
        setCustomer(null)
        setPrescription(null)
        setReviewData(null)
        clearCart()
      } else {
        toast.error(responseData?.message || "Failed to complete sale")
      }
    } catch (error: unknown) {
      console.error("Error completing sale:", error)
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
            <Button variant="ghost" size="sm" onClick={() => {
              clearCart()
              setReviewData(null)
            }}>
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
                    <p className="text-xs text-muted-foreground">Add customer information for this sale</p>
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

          {/* Prescription Section */}
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
                        <p className="text-xs md:text-sm text-muted-foreground">Dr. {prescription.doctor_name}</p>
                      )}
                      {prescription.prescription && <p className="text-xs text-teal-600">Image attached</p>}
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
                  onClick={() => {
                    clearCart()
                    setReviewData(null)
                  }}
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
                  <div className="p-2 md:p-3 rounded-lg bg-muted flex-shrink-0">
                    <span className="text-lg md:text-xl">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs md:text-sm mb-1 line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground mb-2 md:mb-3">
                      {item.product.unit_of_measure} • ₹{Number(item.unitPrice).toFixed(2)} each
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 md:space-x-2">
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
                      <div className="text-right">
                        <p className="font-bold text-sm md:text-base">₹{Number(item.totalPrice).toFixed(2)}</p>
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
            <p className="font-semibold text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Summary</p>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{Number(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg md:text-xl pt-2 md:pt-3 border-t-2">
                <span>Total</span>
                <span className="text-teal-600">₹{Number(total).toFixed(2)}</span>
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
            {reviewData && reviewData.status === "review" ? (
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 h-12 md:h-14 text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                disabled={isCompleting}
                onClick={handleCompleteSale}
              >
                {isCompleting ? "Processing..." : `Complete Sale - ₹${Number(total).toFixed(2)}`}
              </Button>
            ) : (
              <>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 md:h-14 text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                  disabled={cartItems.length === 0 || isReviewing || !branchId}
                  onClick={handleReviewSale}
                >
                  {isReviewing ? "Reviewing..." : (
                    <>
                      <FileCheck className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Review Sale
                    </>
                  )}
                </Button>
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 h-12 md:h-14 text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                  disabled={cartItems.length === 0 || isCompleting || !branchId}
                  onClick={handleCompleteSale}
                >
                  {isCompleting ? "Processing..." : `Complete Sale - ₹${Number(total).toFixed(2)}`}
                </Button>
              </>
            )}
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              <Button
                variant="outline"
                className="h-9 md:h-11 text-sm bg-transparent"
                onClick={() => {
                  clearCart()
                  setReviewData(null)
                }}
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
    </div>
  )
}
