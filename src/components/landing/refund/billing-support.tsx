import { Mail, Phone, Clock } from "lucide-react"

export function BillingSupport() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Need Help with Billing or Cancellation?</h2>
      <p className="text-gray-600 text-center mb-6">
        Our billing support team is here to assist you with any questions or concerns.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#0f766e] rounded-lg flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
          <p className="text-[#0f766e] font-medium">billing@pharmy.com</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-[#0f766e] rounded-lg flex items-center justify-center mx-auto mb-3">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
          <p className="text-[#0f766e] font-medium">+1 (555) 123-4567</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-[#0f766e] rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Support Hours</h3>
          <p className="text-gray-700">Mon-Fri, 9 AM - 6 PM PST</p>
        </div>
      </div>
    </div>
  )
}
