import type { ReactNode } from "react"

type AuditTrailRowProps = {
  iconBg: string
  icon: ReactNode
  title: string
  description: string
  timestamp: string
}

export const AuditTrailRow = ({ iconBg, icon, title, description, timestamp }: AuditTrailRowProps) => (
  <div className="flex items-start gap-3 p-3 border border-[#e5e7eb] rounded-lg">
    <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-[#111827] break-words">{title}</p>
      <p className="text-sm text-[#6b7280] break-words">{description}</p>
      <p className="text-xs text-[#9ca3af] mt-1">{timestamp}</p>
    </div>
  </div>
)

