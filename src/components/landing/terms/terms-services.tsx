export function TermsServices() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#111827] mb-4">3. Services Provided</h2>
      <div className="space-y-4 text-[#4b5563]">
        <p>Pharmy provides the following core services:</p>

        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#111827] mb-3">Core Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#6b7280] mt-1">•</span>
                  <span>Inventory & Stock Management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6b7280] mt-1">•</span>
                  <span>Prescription Handling & OCR</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6b7280] mt-1">•</span>
                  <span>Sales & Billing Systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6b7280] mt-1">•</span>
                  <span>Supplier & Purchase Management</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#111827] mb-3">Advanced Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#6b7280] mt-1">•</span>
                  <span>Reporting & Analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6b7280] mt-1">•</span>
                  <span>Compliance & Audit Tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6b7280] mt-1">•</span>
                  <span>AI-powered Automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6b7280] mt-1">•</span>
                  <span>Multi-branch Support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p>Services may be updated, modified, or enhanced through regular software updates and new feature releases.</p>
      </div>
    </section>
  )
}
