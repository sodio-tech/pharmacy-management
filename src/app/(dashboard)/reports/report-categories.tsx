import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Package, Truck, ChevronRight } from "lucide-react"

export function ReportCategories() {
  const categories = [
    {
      title: "Sales Reports",
      description: "Revenue, transactions, and trends",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      reports: ["Daily Sales Summary", "Monthly Revenue Report", "Profit & Loss Analysis"],
    },
    {
      title: "Inventory Reports",
      description: "Stock levels, expiry, and valuation",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
      reports: ["Stock Level Report", "Expiry Management", "Inventory Valuation"],
    },
    {
      title: "Supplier Reports",
      description: "Performance, payments, and orders",
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      reports: ["Supplier Performance", "Purchase Analysis", "Payment Tracking"],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {categories.map((category, index) => {
        const Icon = category.icon
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <Icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.reports.map((report, reportIndex) => (
                <Button key={reportIndex} variant="ghost" className="w-full border border-[#E5E7EB] justify-between h-auto p-3 text-left">
                  <span className="text-sm">{report}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
