import { Share2, ArrowRight } from "lucide-react"

export default function DataSharing() {
  return (
    <section className="py-16 px-4 bg-[#f9fafb]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0f766e]/10 rounded-lg flex items-center justify-center">
            <Share2 className="w-5 h-5 text-[#0f766e]" />
          </div>
          <h2 className="text-2xl font-bold">Data Sharing & Disclosure</h2>
        </div>

        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 mb-6">
          <p className="text-[#166534] font-medium">Pharmy does not sell your personal data to third parties.</p>
        </div>

        <p className="text-[#4b5563] mb-6">Information may be shared with trusted partners only when necessary:</p>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <ArrowRight className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
            <p className="text-[#4b5563]">Service providers (payment gateways, SMS/WhatsApp APIs)</p>
          </div>
          <div className="flex items-start gap-3">
            <ArrowRight className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
            <p className="text-[#4b5563]">Regulatory authorities (when legally required)</p>
          </div>
          <div className="flex items-start gap-3">
            <ArrowRight className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
            <p className="text-[#4b5563]">Cloud hosting partners for secure storage</p>
          </div>
        </div>
      </div>
    </section>
  )
}
