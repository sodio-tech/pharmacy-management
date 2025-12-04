import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type ReportRowProps = {
  iconBg: string
  icon: ReactNode
  title: string
  subtitle: string
  badgeClass: string
  badgeLabel: string
  actionIcon: ReactNode
}

export const ReportRow = ({ iconBg, icon, title, subtitle, badgeClass, badgeLabel, actionIcon }: ReportRowProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-[#e5e7eb] rounded-lg">
    <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-[#111827]">{title}</p>
      <p className="text-sm text-[#6b7280]">{subtitle}</p>
    </div>
    <div className="flex items-center gap-2 self-start sm:self-center">
      <Badge variant="secondary" className={badgeClass}>
        {badgeLabel}
      </Badge>
      <Button variant="ghost" size="sm" className="flex-shrink-0">
        {actionIcon}
      </Button>
    </div>
  </div>
)

