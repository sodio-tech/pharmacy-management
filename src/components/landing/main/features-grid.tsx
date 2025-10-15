import { Package, FileText, Pill, BarChart3, Shield, Building2 } from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Smart Inventory Management",
    description: "Real-time stock tracking, automated reordering, and expiry management",
    color: "text-[#0f766e]",
    bgColor: "bg-[#0f766e]/10",
  },
  {
    icon: FileText,
    title: "Effortless Billing & Invoicing",
    description: "POS integration, multiple payment modes, and GST compliance",
    color: "text-[#3b82f6]",
    bgColor: "bg-[#3b82f6]/10",
  },
  {
    icon: Pill,
    title: "AI-Powered Prescription Handling",
    description: "OCR scanning, validation, and digital prescription management",
    color: "text-[#0f766e]",
    bgColor: "bg-[#0f766e]/10",
  },
  {
    icon: BarChart3,
    title: "Advanced Reports & Analytics",
    description: "Comprehensive insights on sales, inventory, and business performance",
    color: "text-[#3b82f6]",
    bgColor: "bg-[#3b82f6]/10",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "End-to-end encryption, regulatory compliance, and audit trails",
    color: "text-[#0f766e]",
    bgColor: "bg-[#0f766e]/10",
  },
  {
    icon: Building2,
    title: "Multi-Branch Support",
    description: "Centralized management for multiple pharmacy locations",
    color: "text-[#3b82f6]",
    bgColor: "bg-[#3b82f6]/10",
  },
]

export function FeaturesGrid() {
  return (
    <section className="bg-[#f9fafb] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Everything Your Pharmacy Needs</h2>
          <p className="text-lg text-[#4b5563] max-w-2xl mx-auto">
            Streamline operations with our comprehensive management suite
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-[#111827] mb-2">{feature.title}</h3>
              <p className="text-[#4b5563] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
