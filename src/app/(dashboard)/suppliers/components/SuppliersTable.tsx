import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Supplier } from "./types"
import { formatDate, formatCurrency, getInitials, getColorForInitials, getSupplierStatus } from "./utils"

interface SuppliersTableProps {
  suppliers: Supplier[]
  loading?: boolean
}

export function SuppliersTable({ suppliers, loading }: SuppliersTableProps) {
  if (loading) return null

  return (
    <>
      {/* Desktop Table - Suppliers */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Supplier</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Order</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Spend</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier.supplier_id} className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className={`h-10 w-10 ${getColorForInitials(supplier.supplier_name)}`}>
                        <AvatarFallback className="text-white font-semibold">
                          {getInitials(supplier.supplier_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{supplier.supplier_name}</p>
                        <p className="text-sm text-muted-foreground">GSTIN: {supplier.gstin}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {supplier.product_categories.map((cat, idx) => (
                        <Badge key={idx} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-muted-foreground">+91 {supplier.phone_number}</p>
                  </td>
                  <td className="py-4 px-4 text-sm">{formatDate(supplier.last_purchase_date)}</td>
                  <td className="py-4 px-4 font-medium">{formatCurrency(supplier.total_purchase_amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Suppliers */}
      <div className="lg:hidden space-y-4">
        {suppliers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No suppliers found</div>
        ) : (
          suppliers.map((supplier) => {
            const status = getSupplierStatus(supplier.last_purchase_date)
            return (
              <Card key={supplier.supplier_id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-4">
                    <Avatar className={`h-12 w-12 flex-shrink-0 ${getColorForInitials(supplier.supplier_name)}`}>
                      <AvatarFallback className="text-white font-semibold">
                        {getInitials(supplier.supplier_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base">{supplier.supplier_name}</p>
                      <p className="text-sm text-muted-foreground truncate">GSTIN: {supplier.gstin}</p>
                    </div>
                    <Badge
                      variant={status === "Active" ? "default" : "secondary"}
                      className={
                        status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <div className="flex flex-wrap gap-1">
                        {supplier.product_categories.map((cat, idx) => (
                          <Badge key={idx} variant="secondary">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Contact</span>
                      <span className="text-sm font-medium">+91 {supplier.phone_number}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Order</span>
                      <span className="text-sm font-medium">{formatDate(supplier.last_purchase_date)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Spend</span>
                      <span className="text-sm font-medium">{formatCurrency(supplier.total_purchase_amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </>
  )
}

