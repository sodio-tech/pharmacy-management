export function TermsPayment() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#111827] mb-4">5. Payment & Subscription</h2>
      <div className="space-y-4 text-[#4b5563]">
        <p>Pharmy operates on a subscription-based model with the following terms:</p>

        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-6">
          <h3 className="font-semibold text-[#111827] mb-4">Subscription Plans</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-[#111827] mb-1">Basic:</p>
              <p>Single pharmacy, core features</p>
            </div>
            <div>
              <p className="font-medium text-[#111827] mb-1">Pro:</p>
              <p>Multi-branch, AI features, integrations</p>
            </div>
            <div>
              <p className="font-medium text-[#111827] mb-1">Enterprise:</p>
              <p>Franchise support, advanced reporting</p>
            </div>
          </div>
        </div>

        <ul className="space-y-2 ml-6">
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>
              <strong>Billing cycles:</strong> Monthly or annual subscriptions
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>
              <strong>Auto-renewal:</strong> Subscriptions renew automatically unless canceled
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>
              <strong>Refunds:</strong> No refunds after service activation, except as required by law
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>
              <strong>Taxes:</strong> Users are responsible for applicable GST, VAT, or sales taxes
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>
              <strong>Payment failures</strong> may result in service suspension
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}
