import { FileText, Check } from "lucide-react"
import Image from "next/image"

export function PrescriptionFeature() {
  const features = [
    "Upload prescriptions (image/PDF formats)",
    "AI-powered OCR digitization with 99% accuracy",
    "Validation workflow before dispensing",
    "Direct prescription-to-order linking",
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#0f766e]/10 mb-6">
              <FileText className="w-7 h-7 text-[#0f766e]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">AI-Powered Prescription Handling</h2>
            <p className="text-lg text-[#4b5563] mb-6 leading-relaxed">
              Revolutionary prescription management with AI-powered OCR scanning, digital validation, and seamless order
              integration.
            </p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0f766e] mt-0.5 flex-shrink-0" />
                  <span className="text-[#374151]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-xl border border-[#e5e7eb]">
              <Image
                src="/prescription-management-dashboard-interface.jpg"
                alt="Prescription management dashboard interface"
                width={700}
                height={500}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
