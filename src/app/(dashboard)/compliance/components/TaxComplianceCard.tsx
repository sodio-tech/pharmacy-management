import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export const TaxComplianceCard = () => (
  <Card className="border-[#e5e7eb]">
    <CardHeader className="pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardTitle className="text-lg font-semibold text-[#111827]">Tax Compliance</CardTitle>
        <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] border-[#16a34a] w-fit">
          Up to Date
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#dbeafe] rounded-lg">
        <div className="w-8 h-8 bg-[#2563eb] rounded-full flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#111827]">GST Return - December</p>
          <p className="text-sm text-[#6b7280]">GSTR-1, GSTR-3B</p>
        </div>
        <div className="flex flex-col sm:text-right gap-1">
          <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] w-fit">
            Filed
          </Badge>
          <p className="text-xs text-[#6b7280]">Filed: Jan 10, 2025</p>
        </div>
      </div>

      {/* <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#f3e8ff] rounded-lg">
        <div className="w-8 h-8 bg-[#9333ea] rounded-full flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#111827]">Income Tax Return</p>
          <p className="text-sm text-[#6b7280]">AY 2024-25</p>
        </div>
        <div className="flex flex-col sm:text-right gap-1">
          <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] w-fit">
            Filed
          </Badge>
          <p className="text-xs text-[#6b7280]">Filed: Jul 15, 2024</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#f0fdf4] rounded-lg">
        <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#111827]">TDS Compliance</p>
          <p className="text-sm text-[#6b7280]">Monthly TDS returns</p>
        </div>
        <div className="flex flex-col sm:text-right gap-1">
          <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] w-fit">
            Current
          </Badge>
          <p className="text-xs text-[#6b7280]">Last: Dec 2024</p>
        </div>
      </div> */}
    </CardContent>
  </Card>
)

