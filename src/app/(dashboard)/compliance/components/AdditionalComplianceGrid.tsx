import { RecentAuditTrail } from "./RecentAuditTrail"
import { ComplianceReports } from "./ComplianceReports"

export const AdditionalComplianceGrid = () => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
    <RecentAuditTrail />
    <ComplianceReports />
  </div>
)

