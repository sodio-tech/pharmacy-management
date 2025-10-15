import { Info } from "lucide-react"

export function ImportantInfo() {
  return (
    <div className="bg-[#f0fdfa] border border-[#99f6e4] rounded-lg p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-[#0f766e] rounded-full flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Important Information</h2>
          <p className="text-gray-700 mb-3">
            Pharmy is a subscription-based pharmacy management software designed to streamline your pharmacy operations.
            Our policy applies to all users purchasing subscriptions across all plans (Community, Basic, Pro, and
            Enterprise).
          </p>
          <p className="text-gray-700">
            This policy is effective as of the date of your subscription and governs all billing, refund, and
            cancellation procedures.
          </p>
        </div>
      </div>
    </div>
  )
}
