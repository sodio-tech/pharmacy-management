import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

export function SupplierBottomSections() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* Recent Purchase Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Recent Purchase Orders</CardTitle>
          <Button variant="link" className="text-teal-600 p-0">
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">PO-2024-001</p>
              <p className="text-sm text-muted-foreground">MediCore Pharmaceuticals</p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹45,000</p>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Pending
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">PO-2024-002</p>
              <p className="text-sm text-muted-foreground">HealthPlus Distributors</p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹28,500</p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Delivered
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Due */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Payment Due</CardTitle>
          <Button variant="link" className="text-teal-600 p-0">
            Pay Now
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">MediCore Pharmaceuticals</p>
              <p className="text-sm text-red-600">Overdue by 5 days</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-600">₹1,25,000</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Wellness Supplements</p>
              <p className="text-sm text-orange-600">Due in 2 days</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-orange-600">₹85,000</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
          <Button variant="link" className="text-teal-600 p-0">
            View Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Wellness Supplements Ltd</p>
              <p className="text-sm text-muted-foreground">98.5% delivery rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
