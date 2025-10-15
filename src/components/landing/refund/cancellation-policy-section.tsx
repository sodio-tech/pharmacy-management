import { XCircle, ArrowRight } from "lucide-react"

export function CancellationPolicySection() {
  const policies = [
    "Users may cancel their subscription at any time via the dashboard or by contacting support",
    "Cancellation takes effect at the end of the current billing cycle",
    "No partial or prorated refunds for unused days within the billing period",
    "Access to Pharmy continues until the end of your paid period",
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#3b82f6] rounded-lg flex items-center justify-center">
          <XCircle className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Cancellation Policy</h2>
      </div>
      <ul className="space-y-3">
        {policies.map((policy, index) => (
          <li key={index} className="flex items-start gap-3">
            <ArrowRight className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{policy}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
