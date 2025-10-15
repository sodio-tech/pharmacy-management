import { Gift, Check } from "lucide-react"

export function FreeTrialPolicy() {
  const features = [
    "Pharmy offers a 14-day free trial for new users to explore our platform",
    "No charges are applied during the trial period",
    "Subscription billing begins only after the trial ends",
    "You can cancel anytime during the trial with no obligations",
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#3b82f6] rounded-lg flex items-center justify-center">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Free Trial Policy</h2>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
