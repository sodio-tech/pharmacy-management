import { Badge } from "@/components/ui/badge"
import { formatDate, getLicenseBadgeVisuals } from "../utils"
import type { LicenseEntry } from "../types"

export const LicensePermitRow = ({
  title,
  numberLabel,
  number,
  expiry,
  hasExpiry,
  isExpired,
  containerClass,
  iconWrapperClass,
  icon,
}: LicenseEntry) => {
  const { badgeLabel, badgeClass } = getLicenseBadgeVisuals(hasExpiry, isExpired)

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg ${containerClass}`}>
      <div className={`w-8 h-8 ${iconWrapperClass} rounded-full flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#111827]">{title}</p>
        <p className="text-sm text-[#6b7280] break-words">
          {numberLabel}: {number || "Not provided"}
        </p>
      </div>
      <div className="flex flex-col sm:text-right gap-1">
        <Badge variant="secondary" className={`w-fit ${badgeClass}`}>
          {badgeLabel}
        </Badge>
        <p className="text-xs text-[#6b7280]">
          {hasExpiry ? `Expires: ${formatDate(expiry)}` : "Expiry not provided"}
        </p>
      </div>
    </div>
  )
}

