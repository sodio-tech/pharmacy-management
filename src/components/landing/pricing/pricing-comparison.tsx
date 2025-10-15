import { Check, X } from "lucide-react"

const features = [
  {
    name: "Number of Branches",
    community: "1",
    basic: "1",
    pro: "Up to 5",
    enterprise: "Unlimited",
  },
  {
    name: "Inventory Management",
    community: true,
    basic: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "Sales & Billing",
    community: true,
    basic: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "AI-powered OCR",
    community: false,
    basic: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "Advanced Analytics",
    community: false,
    basic: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "Fraud Detection",
    community: false,
    basic: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "Voice Search",
    community: false,
    basic: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "API Integrations",
    community: "Basic",
    basic: "Basic",
    pro: "Standard",
    enterprise: "Custom",
  },
  {
    name: "Support",
    community: "Email",
    basic: "Email",
    pro: "Email + Chat",
    enterprise: "Priority + Phone",
  },
]

export function PricingComparison() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#111827] mb-4">Compare Plans</h2>
          <p className="text-lg text-[#4b5563]">See what's included in each plan</p>
        </div>

        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden min-w-[800px]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[#111827]">Features</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-[#0f766e]">Community</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-[#111827]">Basic</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-[#111827]">Pro</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-[#111827]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-[#e5e7eb] last:border-0">
                    <td className="py-4 px-6 text-sm text-[#374151] font-medium">{feature.name}</td>
                    <td className="py-4 px-6 text-center">{renderCell(feature.community)}</td>
                    <td className="py-4 px-6 text-center">{renderCell(feature.basic)}</td>
                    <td className="py-4 px-6 text-center">{renderCell(feature.pro)}</td>
                    <td className="py-4 px-6 text-center">{renderCell(feature.enterprise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function renderCell(value: boolean | string) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-[#0f766e] mx-auto" />
    ) : (
      <X className="h-5 w-5 text-[#d1d5db] mx-auto" />
    )
  }
  return <span className="text-sm text-[#374151]">{value}</span>
}
