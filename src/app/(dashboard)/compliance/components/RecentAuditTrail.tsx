import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, Shield, User } from "lucide-react"
import { AuditTrailRow } from "./AuditTrailRow"

export const RecentAuditTrail = () => (
  <Card className="border-[#e5e7eb]">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between gap-3">
        <CardTitle className="text-lg font-semibold text-[#111827]">Recent Audit Trail</CardTitle>
        <Button variant="ghost" size="sm" className="text-[#0f766e] flex-shrink-0">
          View All
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <AuditTrailRow
        iconBg="bg-[#dbeafe]"
        icon={<User className="w-4 h-4 text-[#2563eb]" />}
        title="User Login - Dr. Sarah Wilson"
        description="Successfully logged into system"
        timestamp="2 minutes ago"
      />
      <AuditTrailRow
        iconBg="bg-[#dcfce7]"
        icon={<Shield className="w-4 h-4 text-[#16a34a]" />}
        title="Controlled Substance Sale"
        description="Tramadol 50mg - 10 units sold"
        timestamp="30 minutes ago"
      />
      <AuditTrailRow
        iconBg="bg-[#f3e8ff]"
        icon={<FileText className="w-4 h-4 text-[#9333ea]" />}
        title="Prescription Validated"
        description="Prescription ID: PRX20240001234"
        timestamp="1 hour ago"
      />
      <AuditTrailRow
        iconBg="bg-[#fef9c3]"
        icon={<AlertTriangle className="w-4 h-4 text-[#ca8a04]" />}
        title="Compliance Alert"
        description="Fire safety certificate renewal due"
        timestamp="2 hours ago"
      />
    </CardContent>
  </Card>
)

