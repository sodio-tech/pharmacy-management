import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PurchaseOrder } from "./types"
import { formatDate, formatCurrency, getInitials, getColorForInitials } from "./utils"
import { CheckCircle2 } from "lucide-react"

interface OrdersTableProps {
  orders: PurchaseOrder[]
  loading?: boolean
  onComplete?: (orderId: number) => void
  completingOrderId?: number | null
}

export function OrdersTable({ orders, loading, onComplete, completingOrderId }: OrdersTableProps) {
  if (loading) return null

  return (
    <>
      {/* Desktop Table - Purchase Orders */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Supplier</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Purchase Date</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  No purchase orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <p className="font-medium">#{order.id}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className={`h-10 w-10 ${getColorForInitials(order.supplier_name)}`}>
                        <AvatarFallback className="text-white font-semibold">
                          {getInitials(order.supplier_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{order.supplier_name}</p>
                        <p className="text-sm text-muted-foreground">+91 {order.phone_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="secondary">{order.product_category_name}</Badge>
                  </td>
                  <td className="py-4 px-4 text-sm">{formatDate(order.purchase_date)}</td>
                  <td className="py-4 px-4 font-medium">{formatCurrency(order.purchase_amount)}</td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={order.is_delivered ? "default" : "secondary"}
                      className={
                        order.is_delivered ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                      }
                    >
                      {order.is_delivered ? "Delivered" : "Pending"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    {!order.is_delivered && onComplete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onComplete(order.id)}
                        disabled={completingOrderId === order.id}
                        className="gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {completingOrderId === order.id ? "Marking..." : "Mark Complete"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Purchase Orders */}
      <div className="lg:hidden space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No purchase orders found</div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <Avatar className={`h-12 w-12 flex-shrink-0 ${getColorForInitials(order.supplier_name)}`}>
                    <AvatarFallback className="text-white font-semibold">
                      {getInitials(order.supplier_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base">{order.supplier_name}</p>
                    <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                  </div>
                  <Badge
                    variant={order.is_delivered ? "default" : "secondary"}
                    className={
                      order.is_delivered ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                    }
                  >
                    {order.is_delivered ? "Delivered" : "Pending"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge variant="secondary">{order.product_category_name}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contact</span>
                    <span className="text-sm font-medium">+91 {order.phone_number}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Purchase Date</span>
                    <span className="text-sm font-medium">{formatDate(order.purchase_date)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-sm font-medium">{formatCurrency(order.purchase_amount)}</span>
                  </div>

                  {!order.is_delivered && onComplete && (
                    <div className="pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onComplete(order.id)}
                        disabled={completingOrderId === order.id}
                        className="w-full gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {completingOrderId === order.id ? "Marking..." : "Mark as Completed"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  )
}

