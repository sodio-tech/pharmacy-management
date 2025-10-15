import { RefreshCw, Repeat } from "lucide-react"

export function RenewalPlanChanges() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Renewal Policy */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#0f766e] rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Renewal Policy</h2>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-[#0f766e] rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-700">
              Subscriptions <span className="font-semibold">auto-renew by default</span> (monthly or annual)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-[#0f766e] rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-700">Turn off auto-renewal in account settings before renewal date</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-[#0f766e] rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-700">Failed payments may result in service suspension</span>
          </li>
        </ul>
      </div>

      {/* Plan Changes */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-lg flex items-center justify-center">
            <Repeat className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Plan Changes</h2>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-700">
              <span className="font-semibold">Upgrades:</span> Take effect immediately with prorated billing
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-700">
              <span className="font-semibold">Downgrades:</span> Take effect from next billing cycle
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-700">Change plans anytime through your dashboard</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
