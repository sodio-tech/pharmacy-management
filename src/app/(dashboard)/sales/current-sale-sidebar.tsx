"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Plus, Minus, CreditCard, Wallet, Smartphone, Banknote, User, Camera } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { toast } from "react-toastify"
import { CustomerModal } from "./customer-modal"
import { Customer } from "@/types/sales"

export function CurrentSaleSidebar() {
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
    isProcessing
  } = useCart()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('CASH')

  const subtotal = getCartSubtotal()
  const tax = getCartTax()
  const discount = getCartDiscount()
  const total = getCartTotal()
  const itemCount = getItemCount()

  const handleSaveCustomer = (customerData: Customer) => {
    setCustomer(customerData)
  }

  const handleEditCustomer = () => {
    setIsCustomerModalOpen(true)
  }

  const handleCreateCustomer = () => {
    setIsCustomerModalOpen(true)
  }

  const paymentMethods = [
    { name: "Cash", value: "CASH", icon: Banknote },
    { name: "Card", value: "CARD", icon: CreditCard },
    { name: "UPI", value: "UPI", icon: Smartphone },
    { name: "Wallet", value: "WALLET", icon: Wallet },
  ]

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
              {customer && (
                <p className="text-xs md:text-sm text-teal-600 font-medium">Customer: {customer.patient_name}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart}>
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
                    <AvatarImage src={customer.prescription_photo || "/placeholder.svg"} />
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

              {/* Doctor Info */}
              <div className="pl-12 md:pl-15 space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <p className="text-xs md:text-sm font-medium">Dr. {customer.doctor_name}</p>
                </div>
                {customer.doctor_license && (
                  <p className="text-xs text-muted-foreground pl-5 md:pl-6">License: {customer.doctor_license}</p>
                )}
                {customer.doctor_phone && (
                  <p className="text-xs text-muted-foreground pl-5 md:pl-6">Phone: {customer.doctor_phone}</p>
                )}
              </div>

              {/* Prescription Photo Indicator */}
              {customer.prescription_photo && (
                <div className="flex items-center space-x-2 pl-12 md:pl-15">
                  <Camera className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                  <p className="text-xs text-green-600">Prescription photo attached</p>
                </div>
              )}
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
                  Create Customer
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
                onClick={clearCart}
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

        {/* Discount Code */}
        <div className="space-y-2">
          <p className="font-semibold text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
            Discount Code
          </p>
          <div className="flex space-x-2">
            <Input placeholder="Enter discount code" className="flex-1 h-9 md:h-11 text-sm" />
            <Button variant="outline" className="h-9 md:h-11 px-4 md:px-6 text-sm bg-transparent">
              Apply
            </Button>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="space-y-3 md:space-y-4 pt-3 md:pt-4 border-t-2">
          <p className="font-semibold text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Summary</p>
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">₹{Number(subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-muted-foreground">Tax (GST 12%)</span>
              <span className="font-semibold">₹{Number(tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600 font-semibold">-₹{Number(discount).toFixed(2)}</span>
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
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon
              const isActive = selectedPaymentMethod === method.value
              return (
                <Button
                  key={index}
                  variant={isActive ? "default" : "outline"}
                  className={`h-16 md:h-20 flex-col space-y-1 md:space-y-2 ${isActive ? "bg-teal-600 hover:bg-teal-700" : ""}`}
                  onClick={() => setSelectedPaymentMethod(method.value)}
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-xs md:text-sm font-medium">{method.name}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 md:space-y-3 pt-2">
          <Button
            className="w-full bg-teal-600 hover:bg-teal-700 h-12 md:h-14 text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            disabled={cartItems.length === 0 || isProcessing}
            onClick={async () => {
              if (!customer) {
                toast.error("Please add customer information before completing the sale")
                return
              }

              try {
                await processCheckout(customer, selectedPaymentMethod)
                setCustomer(null) // Clear customer after sale
              } catch (error) {
                // Error is already handled in the processCheckout function
              }
            }}
          >
            {isProcessing ? "Processing..." : `Complete Sale - ₹${Number(total).toFixed(2)}`}
          </Button>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <Button
              variant="outline"
              className="h-9 md:h-11 text-sm bg-transparent"
              disabled={cartItems.length === 0}
            >
              Save Draft
            </Button>
            <Button
              variant="outline"
              className="h-9 md:h-11 text-sm bg-transparent"
              onClick={clearCart}
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
  </div>
  )
}