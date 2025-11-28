

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const pricingPlans = [
  {
    name: "Free Plan (3 Days Trial)",
    price: "₹0",
    period: "",
    popular: false,
    features: [
      "Full Platform Access",
      "Unlimited Pharmacy Operations",
      "Multi-Branch Management",
      "Staff Role Control",
      "No-Restriction Trial",
    ],
  },
  {
    name: "Pro Plan",
    price: "₹3999",
    period: "/year",
    popular: true,
    features: [
      "Unlimited Pharmacy Operations",
      "Full Inventory Control",
      "Advanced Sales & Reports",
      "Multi-Branch Management",
      "Unlimited Staff Accounts",
    ],
  },
  {
    name: "Additional Branch",
    price: "₹1999",
    period: "/year",
    popular: false,
    features: [
      "Expand your pharmacy network",
      "Add unlimited branches",
      "Centralized inventory & reports",
      "Seamless branch switching",
      "Unified staff & role management",
    ],
  },
]

export function PricingSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 text-lg">Choose the plan that fits your pharmacy</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 sm:p-8 transition-all hover:scale-105 ${
                plan.popular ? "border-2 border-[#0f766e] shadow-xl" : "border border-gray-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#0f766e] text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 text-sm sm:text-base">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full text-sm sm:text-base py-5 sm:py-6 ${
                  plan.popular
                    ? "bg-[#0f766e] hover:bg-[#0d6860] text-white"
                    : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                }`}
              >
                Start Free Trial
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
