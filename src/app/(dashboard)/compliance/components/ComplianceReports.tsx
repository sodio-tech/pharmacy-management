import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye, FileText, Plus, Shield } from "lucide-react"
import { ReportRow } from "./ReportRow"

export const ComplianceReports = () => (
  <Card className="border-[#e5e7eb]">
    <CardHeader className="pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardTitle className="text-lg font-semibold text-[#111827]">Compliance Reports</CardTitle>
        <Button className="bg-[#0f766e] hover:bg-[#0d5d56] text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Generate
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <ReportRow
        iconBg="bg-[#dbeafe]"
        icon={<FileText className="w-4 h-4 text-[#2563eb]" />}
        title="Monthly Compliance Report"
        subtitle="December 2024"
        badgeClass="bg-[#dcfce7] text-[#16a34a]"
        badgeLabel="Ready"
        actionIcon={<Download className="w-4 h-4" />}
      />
      <ReportRow
        iconBg="bg-[#fee2e2]"
        icon={<Shield className="w-4 h-4 text-[#dc2626]" />}
        title="Controlled Substances Log"
        subtitle="Q4 2024"
        badgeClass="bg-[#dcfce7] text-[#16a34a]"
        badgeLabel="Ready"
        actionIcon={<Download className="w-4 h-4" />}
      />
      <ReportRow
        iconBg="bg-[#f3e8ff]"
        icon={<FileText className="w-4 h-4 text-[#9333ea]" />}
        title="Audit Compliance Report"
        subtitle="Annual 2024"
        badgeClass="bg-[#fef9c3] text-[#ca8a04]"
        badgeLabel="Pending"
        actionIcon={<Eye className="w-4 h-4" />}
      />
    </CardContent>
  </Card>
)

