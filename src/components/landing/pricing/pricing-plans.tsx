import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const pricingPlans = [
  {
    name: "Free Plan (3 Days Trial)",
    // badge: "Free Forever",
    badgeColor: "bg-[#0f766e]",
    price: "₹0",
    period: "",
    description: "Perfect to get started",
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const,
    buttonColor: "bg-[#0f766e] hover:bg-[#0f766e]/90",
    cardBg: "bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0]",
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
    badge: "Most Popular",
    badgeColor: "bg-[#0f766e]",
    price: "₹3999",
    period: "/year",
    description: "For growing pharmacies",
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const,
    buttonColor: "bg-[#0f766e] hover:bg-[#0f766e]/90",
    border: "border-2 border-[#0f766e]",
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
    description: "Expand your network",
    buttonText: "Start Free Trial",
    buttonVariant: "outline" as const,
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
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-[#f9fafb]">
      <div className="container mx-auto">
      <div className="text-center mb-16">
           <h2 className="text-4xl font-bold text-[#111827] mb-4">Choose Your Plan</h2>
          <p className="text-lg text-[#4b5563]">Start free and upgrade as you grow</p>
          </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 sm:p-8 ${plan.cardBg || "bg-white"} ${
                plan.border || ""
              } shadow-lg hover:shadow-xl transition-all hover:scale-105`}
            >
              {plan.badge && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                  <span
                    className={`${plan.badgeColor} text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 rounded-full whitespace-nowrap`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6 sm:mb-8 mt-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2">{plan.name}</h3>
                <p className="text-sm text-[#4b5563] mb-4 sm:mb-6">{plan.description}</p>

                <div className="mb-6 sm:mb-8">
                  <span className="text-4xl sm:text-5xl font-bold text-[#111827]">{plan.price}</span>
                  {plan.period && <span className="text-[#4b5563] text-base sm:text-lg">{plan.period}</span>}
                </div>

                <Button
                  variant={plan.buttonVariant}
                  className={`w-full text-sm sm:text-base py-5 sm:py-6 ${
                    plan.buttonColor || "border-[#0f766e] text-[#0f766e] hover:bg-[#0f766e]/5"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>

              <ul className="space-y-3 sm:space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-[#374151] leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
