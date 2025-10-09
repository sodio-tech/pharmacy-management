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

interface CustomerData {
  id: string
  patientName: string
  patientPhone: string
  patientEmail: string
  doctorName: string
  doctorLicense?: string
  doctorPhone?: string
  prescriptionPhoto?: string
  prescriptionText?: string
  createdAt: string
}

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
    getItemCount
  } = useCart()

  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)

  const subtotal = getCartSubtotal()
  const tax = getCartTax()
  const discount = getCartDiscount()
  const total = getCartTotal()
  const itemCount = getItemCount()

  const handleSaveCustomer = (customerData: CustomerData) => {
    setCustomer(customerData)
  }

  const handleEditCustomer = () => {
    setIsCustomerModalOpen(true)
  }

  const handleCreateCustomer = () => {
    setIsCustomerModalOpen(true)
  }

  const paymentMethods = [
    { name: "Cash", icon: Banknote, active: true },
    { name: "Card", icon: CreditCard, active: false },
    { name: "UPI", icon: Smartphone, active: false },
    { name: "Wallet", icon: Wallet, active: false },
  ]

  return (
    <div className="w-96 bg-background rounded-xl ">
      <Card className="h-full rounded-xl">
        <CardHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Current Sale</CardTitle>
              <div className="space-y-1">
                {itemCount > 0 && (
                  <p className="text-sm text-muted-foreground">{itemCount} item{itemCount !== 1 ? 's' : ''} in cart</p>
                )}
                {customer && (
                  <p className="text-sm text-teal-600 font-medium">Customer: {customer.patientName}</p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearCart}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="p-4 rounded-lg bg-muted/50">
            {customer ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={customer.prescriptionPhoto} />
                      <AvatarFallback>
                        {customer.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-base">{customer.patientName}</p>
                      <p className="text-sm text-muted-foreground">{customer.patientPhone}</p>
                      {customer.patientEmail && (
                        <p className="text-xs text-muted-foreground">{customer.patientEmail}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-teal-600 hover:text-teal-700"
                    onClick={handleEditCustomer}
                  >
                    Edit
                  </Button>
                </div>
                
                {/* Doctor Info */}
                <div className="pl-15 space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Dr. {customer.doctorName}</p>
                  </div>
                  {customer.doctorLicense && (
                    <p className="text-xs text-muted-foreground pl-6">License: {customer.doctorLicense}</p>
                  )}
                  {customer.doctorPhone && (
                    <p className="text-xs text-muted-foreground pl-6">Phone: {customer.doctorPhone}</p>
                  )}
                </div>

                {/* Prescription Photo Indicator */}
                {customer.prescriptionPhoto && (
                  <div className="flex items-center space-x-2 pl-15">
                    <Camera className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-green-600">Prescription photo attached</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 rounded-full bg-muted">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">No customer selected</p>
                    <p className="text-xs text-muted-foreground">Add customer information for this sale</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCreateCustomer}
                    className="text-teal-600 hover:text-teal-700 border-teal-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Create Customer
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Cart Items</p>
              {cartItems.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No items in cart</p>
                <p className="text-xs">Add products to get started</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <div className="p-3 rounded-lg bg-muted flex-shrink-0">
                    <span className="text-xl">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-1">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {item.product.unit_of_measure} • ₹{Number(item.unitPrice).toFixed(2)} each
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-base">₹{Number(item.totalPrice).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Discount Code */}
          <div className="space-y-2">
            <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Discount Code</p>
            <div className="flex space-x-2">
              <Input placeholder="Enter discount code" className="flex-1 h-11" />
              <Button variant="outline" className="h-11 px-6">Apply</Button>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="space-y-4 pt-4 border-t-2">
            <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Summary</p>
            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{Number(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Tax (GST 12%)</span>
                <span className="font-semibold">₹{Number(tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-green-600 font-semibold">-₹{Number(discount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-3 border-t-2">
                <span>Total</span>
                <span className="text-teal-600">₹{Number(total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Payment Method</p>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <Button
                    key={index}
                    variant={method.active ? "default" : "outline"}
                    className={`h-20 flex-col space-y-2 ${method.active ? "bg-teal-600 hover:bg-teal-700" : ""}`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{method.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              className="w-full bg-teal-600 hover:bg-teal-700 h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              disabled={cartItems.length === 0}
              onClick={() => {
                if (!customer) {
                  toast.error('Please add customer information before completing the sale')
                  return
                }
                
                // TODO: Implement checkout logic with customer data
                console.log('Sale completed with customer:', customer)
                console.log('Cart items:', cartItems)
                toast.success('Sale completed successfully!')
                clearCart()
                setCustomer(null) // Clear customer after sale
              }}
            >
              Complete Sale - ₹{Number(total).toFixed(2)}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11" disabled={cartItems.length === 0}>
                Save Draft
              </Button>
              <Button 
                variant="outline" 
                className="h-11" 
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