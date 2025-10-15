import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Community",
    badge: "Free Forever",
    badgeColor: "bg-[#0f766e]",
    price: "Free",
    period: "",
    description: "Perfect to get started",
    buttonText: "Start Free",
    buttonVariant: "default" as const,
    buttonColor: "bg-[#0f766e] hover:bg-[#0f766e]/90",
    cardBg: "bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0]",
    features: [
      "1 Branch",
      "Up to 20 items",
      "10 invoices/month",
      "5 suppliers max",
      "Basic expiry alerts",
      "Sales reports only",
    ],
  },
  {
    name: "Basic",
    price: "$49",
    period: "/month",
    description: "For independent pharmacies",
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    features: [
      "1 Branch",
      "Admin + Pharmacist roles",
      "Unlimited inventory",
      "Multi-payment support",
      "Manual prescriptions",
      "Basic + expiry reports",
      "Email/SMS alerts",
    ],
  },
  {
    name: "Pro",
    badge: "Most Popular",
    badgeColor: "bg-[#0f766e]",
    price: "$99",
    period: "/month",
    description: "For growing pharmacies",
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const,
    buttonColor: "bg-[#0f766e] hover:bg-[#0f766e]/90",
    border: "border-2 border-[#0f766e]",
    features: [
      "Up to 5 branches",
      "Everything in Basic +",
      "AI-powered OCR",
      "Stock forecasting",
      "Supplier management",
      "Advanced analytics",
      "WhatsApp alerts",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large networks",
    buttonText: "Contact Sales",
    buttonVariant: "default" as const,
    buttonColor: "bg-[#3b82f6] hover:bg-[#3b82f6]/90",
    features: [
      "Unlimited branches",
      "Everything in Pro +",
      "Franchise dashboard",
      "Custom integrations",
      "Fraud detection",
      "Voice search",
      "Dedicated manager",
      "Priority support",
    ],
  },
]

export function PricingPlans() {
  return (
    <section className="py-20 px-4 bg-[#f9fafb]">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#111827] mb-4">Choose Your Plan</h2>
          <p className="text-lg text-[#4b5563]">Start free and upgrade as you grow</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 ${plan.cardBg || "bg-white"} ${plan.border || ""} shadow-lg hover:shadow-xl transition-shadow`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`${plan.badgeColor} text-white text-xs font-semibold px-4 py-1 rounded-full`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <div className="text-center mb-6 mt-2">
                <h3 className="text-xl font-bold text-[#111827] mb-2">{plan.name}</h3>
                <p className="text-sm text-[#4b5563] mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#111827]">{plan.price}</span>
                  {plan.period && <span className="text-[#4b5563]">{plan.period}</span>}
                </div>

                {/* Button */}
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${plan.buttonColor || "border-[#0f766e] text-[#0f766e] hover:bg-[#0f766e]/5"}`}
                >
                  {plan.buttonText}
                </Button>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#374151]">{feature}</span>
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
