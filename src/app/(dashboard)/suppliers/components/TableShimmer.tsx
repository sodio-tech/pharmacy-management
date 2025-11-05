import { Card, CardContent } from "@/components/ui/card"

interface TableShimmerProps {
  type: "suppliers" | "orders"
  rows?: number
}

export function TableShimmer({ type, rows = 5 }: TableShimmerProps) {
  return (
    <>
      {/* Desktop Table Shimmer */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {type === "suppliers" ? (
                <>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Supplier</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Order</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Spend</th>
                </>
              ) : (
                <>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Supplier</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Purchase Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index} className="border-b">
                {type === "suppliers" ? (
                  <>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                          <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-28 bg-muted rounded animate-pulse"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-4 px-4">
                      <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                          <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards Shimmer */}
      <div className="lg:hidden space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="h-12 w-12 bg-muted rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

