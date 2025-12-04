import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LicensePermitRow } from "./LicensePermitRow"
import type { LicenseEntry } from "../types"

type LicensePermitsSectionProps = {
  entries: LicenseEntry[]
  missingExpiryData: boolean
  overallValid: boolean
}

export const LicensePermitsSection = ({
  entries,
  missingExpiryData,
  overallValid,
}: LicensePermitsSectionProps) => {
  const badgeClass = missingExpiryData
    ? "bg-[#e5e7eb] text-[#6b7280] border-[#d1d5db]"
    : overallValid
    ? "bg-[#dcfce7] text-[#16a34a] border-[#16a34a]"
    : "bg-[#fee2e2] text-[#dc2626] border-[#dc2626]"

  const badgeLabel = missingExpiryData ? "Not Available" : overallValid ? "Valid" : "Some Licenses Expired"

  return (
    <Card className="border-[#e5e7eb]">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-[#111827]">Drug License & Permits</CardTitle>
          <Badge variant="secondary" className={`w-fit border ${badgeClass}`}>
            {badgeLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => (
          <LicensePermitRow key={entry.id} {...entry} />
        ))}
      </CardContent>
    </Card>
  )
}

