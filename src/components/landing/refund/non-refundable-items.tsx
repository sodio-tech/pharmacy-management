import { Ban, X } from "lucide-react"

export function NonRefundableItems() {
  const items = [
    "One-time setup or customization fees (if applicable)",
    "Third-party service charges (SMS/WhatsApp credits, payment gateway fees)",
    "Integration setup fees for external systems",
    "Training or consultation services purchased separately",
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#ef4444] rounded-lg flex items-center justify-center">
          <Ban className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Non-Refundable Items</h2>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <X className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
