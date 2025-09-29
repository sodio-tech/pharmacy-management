import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Package, Truck, Eye, Download, Share2 } from "lucide-react"

export function RecentReportsTable() {
  const reports = [
    {
      name: "Monthly Sales Report",
      subtitle: "December 2024",
      type: "Sales",
      period: "Dec 1 - Dec 31, 2024",
      generated: "2 hours ago",
      status: "Ready",
      icon: FileText,
      iconColor: "text-blue-600",
    },
    {
      name: "Inventory Valuation",
      subtitle: "Year-end report",
      type: "Inventory",
      period: "Jan 1 - Dec 31, 2024",
      generated: "5 hours ago",
      status: "Processing",
      icon: Package,
      iconColor: "text-green-600",
    },
    {
      name: "Supplier Performance",
      subtitle: "Q4 2024 analysis",
      type: "Supplier",
      period: "Oct 1 - Dec 31, 2024",
      generated: "1 day ago",
      status: "Ready",
      icon: Truck,
      iconColor: "text-purple-600",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Reports</CardTitle>
        <Button className="bg-teal-600 hover:bg-teal-700">Generate Report</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Report Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Period</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Generated</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => {
                const Icon = report.icon
                return (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Icon className={`h-4 w-4 ${report.iconColor}`} />
                        </div>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">{report.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="outline"
                        className={
                          report.type === "Sales"
                            ? "text-blue-600 border-blue-200"
                            : report.type === "Inventory"
                              ? "text-green-600 border-green-200"
                              : "text-purple-600 border-purple-200"
                        }
                      >
                        {report.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{report.period}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{report.generated}</td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={report.status === "Ready" ? "default" : "secondary"}
                        className={
                          report.status === "Ready" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {report.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
