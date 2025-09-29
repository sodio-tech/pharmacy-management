import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Plus, Minus, CreditCard, Wallet, Smartphone, Banknote } from "lucide-react"

export function CurrentSaleSidebar() {
  const cartItems = [
    {
      name: "Paracetamol 500mg",
      description: "Strip of 10 tablets",
      quantity: 2,
      price: 120,
      icon: "💊",
      color: "bg-blue-100",
    },
    {
      name: "Amoxicillin 250mg",
      description: "Bottle of 30 capsules",
      quantity: 1,
      price: 350,
      icon: "🦠",
      color: "bg-green-100",
    },
  ]

  const subtotal = 470.0
  const tax = 56.4
  const discount = 0.0
  const total = 526.4

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
            <CardTitle className="text-xl">Current Sale</CardTitle>
            <Button variant="ghost" size="sm">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/diverse-woman-portrait.png" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-base">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
              Change
            </Button>
          </div>

          {/* Cart Items */}
          <div className="space-y-3">
            <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Cart Items</p>
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                <div className={`p-3 rounded-lg ${item.color} flex-shrink-0`}>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">{item.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-base">₹{item.price}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Tax (GST 12%)</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-green-600 font-semibold">-₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-3 border-t-2">
                <span>Total</span>
                <span className="text-teal-600">₹{total.toFixed(2)}</span>
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
            <Button className="w-full bg-teal-600 hover:bg-teal-700 h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
              Complete Sale - ₹{total.toFixed(2)}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11">Save Draft</Button>
              <Button variant="outline" className="h-11">Clear Cart</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}