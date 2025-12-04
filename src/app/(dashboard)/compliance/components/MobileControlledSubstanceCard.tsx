import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type MobileControlledSubstanceCardProps = {
  title: string
  batch: string
  schedule: string
  stock: string
  lastTransaction: string
  statusBadgeClass: string
  statusLabel: string
  scheduleBadgeClass: string
}

export const MobileControlledSubstanceCard = ({
  title,
  batch,
  schedule,
  stock,
  lastTransaction,
  statusBadgeClass,
  statusLabel,
  scheduleBadgeClass,
}: MobileControlledSubstanceCardProps) => (
  <div className="border border-[#e5e7eb] rounded-lg p-4 space-y-3">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#111827]">{title}</p>
        <p className="text-sm text-[#6b7280]">Batch: {batch}</p>
      </div>
      <Badge variant="destructive" className={`flex-shrink-0 ${scheduleBadgeClass}`}>
        {schedule}
      </Badge>
    </div>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>
        <p className="text-[#6b7280]">Stock</p>
        <p className="font-medium">{stock}</p>
      </div>
      <div>
        <p className="text-[#6b7280]">Last Transaction</p>
        <p className="font-medium">{lastTransaction}</p>
      </div>
    </div>
    <Badge variant="secondary" className={`w-fit ${statusBadgeClass}`}>
      {statusLabel}
    </Badge>
    <div className="flex flex-col sm:flex-row gap-2">
      <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
        Update
      </Button>
      <Button variant="ghost" size="sm" className="w-full sm:w-auto">
        View Log
      </Button>
    </div>
  </div>
)

