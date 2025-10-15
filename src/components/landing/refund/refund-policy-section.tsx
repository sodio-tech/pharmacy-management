import { RefreshCw, AlertCircle } from "lucide-react"

export function RefundPolicySection() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#0f766e] rounded-lg flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Refund Policy</h2>
      </div>

      <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg p-4 mb-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
        <p className="text-[#991b1b] font-medium">
          Refunds are not available once a subscription is activated and the billing cycle has started.
        </p>
      </div>

      <h3 className="font-semibold text-gray-900 mb-3">Exceptions May Be Considered For:</h3>
      <ul className="space-y-2 mb-4">
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 bg-[#f97316] rounded-full mt-2 flex-shrink-0" />
          <span className="text-gray-700">Duplicate charges due to technical error on our payment system</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 bg-[#f97316] rounded-full mt-2 flex-shrink-0" />
          <span className="text-gray-700">Accidental billing after subscription cancellation due to system error</span>
        </li>
      </ul>

      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4">
        <p className="text-[#15803d]">
          <span className="font-semibold">Processing Time:</span> All approved refunds will be processed within 7-14
          business days via the original payment method.
        </p>
      </div>
    </div>
  )
}
