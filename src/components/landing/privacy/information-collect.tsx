import { FileText } from "lucide-react"

export default function InformationCollect() {
  return (
    <section className="py-16 px-4 bg-[#f9fafb]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-[#4b5563] leading-relaxed mb-6">
            Pharmy is a comprehensive pharmacy management platform designed to help pharmacies streamline their
            operations while maintaining the highest standards of data privacy and security. This Privacy Policy
            explains how we collect, use, protect, and share information when you use our services.
          </p>
          <p className="text-[#4b5563] leading-relaxed">
            By using Pharmy, you agree to the collection and use of information in accordance with this policy. We are
            committed to transparency and will always inform you about any changes to our privacy practices.
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#0f766e]/10 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#0f766e]" />
          </div>
          <h2 className="text-2xl font-bold">Information We Collect</h2>
        </div>

        <div className="bg-white rounded-lg border-l-4 border-[#0f766e] p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
            <p className="text-[#4b5563]">
              Name, email address, phone number, and pharmacy details when you create an account or contact us.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Payment Information</h3>
            <p className="text-[#4b5563]">
              Billing details and transaction data processed through secure payment gateways like Stripe, Razorpay, and
              PayPal.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Usage Data</h3>
            <p className="text-[#4b5563]">
              Device information, IP address, browser type, cookies, and usage patterns to improve our services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Medical Data</h3>
            <p className="text-[#4b5563]">
              Prescription information and medical data only when uploaded by authorized pharmacists for order
              management purposes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
