import { Check, X } from "lucide-react"

const features = [
  {
    name: "Number of Branches",
    free: "1",
    pro: "1 (Add more at ₹1,999/branch/year)",
  },
  {
    name: "Inventory Management",
    free: true,
    pro: true,
  },
  {
    name: "Sales & Billing (POS)",
    free: true,
    pro: true,
  },
  {
    name: "Prescription Management",
    free: true,
    pro: true,
  },
  {
    name: "Advanced Analytics",
    free: false,
    pro: true,
  },
  {
    name: "Compliance Tools",
    free: true,
    pro: true,
  },
  {
    name: "Reports (Basic)",
    free: true,
    pro: "—",
  },
  {
    name: "Reports (Advanced)",
    free: false,
    pro: true,
  },
  {
    name: "User & Staff Management",
    free: "Limited",
    pro: "Unlimited",
  },
  {
    name: "Support",
    free: "Email",
    pro: "Email + Chat",
  },
]

export function PricingComparison() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#111827] mb-4">Compare Plans</h2>
          <p className="text-lg text-[#4b5563]">See what's included in each plan</p>
        </div>
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden min-w-[600px]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <th className="text-left py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold text-[#111827]">
                    Features
                  </th>
                  <th className="text-center py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold text-[#111827]">
                    Free
                  </th>
                  <th className="text-center py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold text-[#111827]">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#f9fafb] transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 text-sm sm:text-base text-[#374151] font-medium">
                      {feature.name}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">{renderCell(feature.free)}</td>
                    <td className="py-4 px-4 sm:px-6 text-center">{renderCell(feature.pro)}</td>
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
