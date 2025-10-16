import { Check } from "lucide-react"
import Image from "next/image"
import feature from "../../../../public/assets/feature4.png"

export function SalesBillingFeature() {
  const features = [
    "Integrated POS system for fast checkout",
    "Invoice generation (print/email/SMS)",
    "Multi-payment modes (cash, card, UPI, wallet, insurance)",
    "Discounts, offers, and loyalty rewards",
    "Automatic GST/tax compliance and reporting",
  ]

  return (
    <section className="py-20 px-6 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Dashboard Image */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={feature}
                alt="Sales & Billing Dashboard Interface"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#3b82f6] mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Sales & Billing</h2>

            <p className="text-[#4b5563] text-lg mb-6">
              Comprehensive billing solution with POS integration, multiple payment modes, and automatic tax compliance
              for seamless transactions.
            </p>

            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
                  <span className="text-[#374151]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
