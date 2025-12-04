import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, FileText } from "lucide-react"
import { formatDate } from "../utils"

type StatusCardsProps = {
  drugHasExpiry: boolean
  drugExpired: boolean
  drugExpiry: string | null
}

export const StatusCards = ({ drugHasExpiry, drugExpired, drugExpiry }: StatusCardsProps) => {
  const statusText = !drugHasExpiry ? "Not Available" : drugExpired ? "Expired" : "Valid"
  const statusColor = !drugHasExpiry ? "text-[#6b7280]" : drugExpired ? "text-[#dc2626]" : "text-[#16a34a]"
  const iconBg = !drugHasExpiry ? "bg-[#e5e7eb]" : drugExpired ? "bg-[#fee2e2]" : "bg-[#dcfce7]"
  const iconColor = !drugHasExpiry ? "text-[#9ca3af]" : drugExpired ? "text-[#dc2626]" : "text-[#16a34a]"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-[#e5e7eb] py-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6b7280] mb-1">Drug License Status</p>
              <p className={`text-2xl font-bold ${statusColor}`}>{statusText}</p>
              <p className="text-xs text-[#6b7280] mt-1">
                {drugHasExpiry ? `Expires: ${formatDate(drugExpiry)}` : "Expiry not provided"}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}>
              <CheckCircle className={`w-6 h-6 ${iconColor}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#e5e7eb] py-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6b7280] mb-1">GST Compliance</p>
              <p className="text-2xl font-bold text-[#16a34a]">100%</p>
              <p className="text-xs text-[#6b7280] mt-1">All returns filed</p>
            </div>
            <div className="w-12 h-12 bg-[#dbeafe] rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#2563eb]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

