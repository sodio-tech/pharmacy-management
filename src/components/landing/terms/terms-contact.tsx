import { Mail, Phone, MapPin } from "lucide-react"

export function TermsContact() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111827]">14. Contact Information</h2>

      <p className="text-[#4b5563] leading-relaxed">
        For legal questions, compliance issues, or concerns about these Terms, please contact:
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center p-6 bg-[#f9fafb] rounded-lg">
          <div className="w-12 h-12 bg-[#0f766e] rounded-lg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-[#111827] mb-2">Email</h3>
          <p className="text-[#4b5563]">contact@studio.tech</p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-[#f9fafb] rounded-lg">
          <div className="w-12 h-12 bg-[#0f766e] rounded-lg flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-[#111827] mb-2">Phone</h3>
          <p className="text-[#4b5563]">+91 97400-54621</p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-[#f9fafb] rounded-lg">
          <div className="w-12 h-12 bg-[#0f766e] rounded-lg flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-[#111827] mb-2">Address</h3>
          <p className="text-[#4b5563]">Rajasthan, India</p>
        </div>
      </div>
    </section>
  )
}
