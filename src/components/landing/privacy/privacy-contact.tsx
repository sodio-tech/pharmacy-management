import { Mail, Phone, MapPin } from "lucide-react"

export default function PrivacyContact() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0f766e]/10 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#0f766e]" />
          </div>
          <h2 className="text-2xl font-bold">Privacy Contact Information</h2>
        </div>

        <p className="text-[#4b5563] mb-8">For any privacy-related questions or concerns, please contact us:</p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#0f766e]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-[#0f766e]" />
            </div>
            <h3 className="font-semibold mb-2">Email</h3>
            <a href="mailto:privacy@pharmy.com" className="text-[#0f766e] hover:underline">
              privacy@pharmy.com
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-[#3b82f6]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-[#3b82f6]" />
            </div>
            <h3 className="font-semibold mb-2">Phone</h3>
            <a href="tel:+15551234567" className="text-[#0f766e] hover:underline">
              +1 (555) 123-4567
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-[#0f766e]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-[#0f766e]" />
            </div>
            <h3 className="font-semibold mb-2">Address</h3>
            <p className="text-[#4b5563] text-sm">
              123 Healthcare Blvd San
              <br />
              Francisco, CA 94105
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
