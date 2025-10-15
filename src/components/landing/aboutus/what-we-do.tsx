import { Package, FileText, Receipt, Truck, BarChart3, Building2 } from "lucide-react"

export function WhatWeDo() {
  const features = [
    {
      icon: Package,
      title: "Smart Inventory & Stock Tracking",
      description: "Real-time inventory management with automated alerts and predictive restocking.",
      color: "teal",
    },
    {
      icon: FileText,
      title: "Prescription Handling with AI OCR",
      description: "Digitize prescriptions instantly with 99% accuracy using advanced OCR technology.",
      color: "blue",
    },
    {
      icon: Receipt,
      title: "Billing & GST/TAX Compliance",
      description: "Automated billing with full tax compliance and multiple payment options.",
      color: "teal",
    },
    {
      icon: Truck,
      title: "Supplier & Purchase Management",
      description: "Streamlined supplier relationships with automated purchase orders and tracking.",
      color: "blue",
    },
    {
      icon: BarChart3,
      title: "AI-driven Reports & Analytics",
      description: "Comprehensive insights and predictive analytics to drive better decisions.",
      color: "teal",
    },
    {
      icon: Building2,
      title: "Multi-Branch & Franchise Support",
      description: "Centralized management for multiple locations with branch-level reporting.",
      color: "blue",
    },
  ]

  return (
    <section className="py-16 bg-[#ffffff]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">What We Do</h2>
          <p className="text-lg text-[#4b5563]">
            Pharmy is an all-in-one pharmacy management platform that combines cutting-edge AI technology with intuitive
            design to streamline every aspect of your pharmacy operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const bgColor = feature.color === "teal" ? "bg-[#0f766e]/10" : "bg-[#3b82f6]/10"
            const iconColor = feature.color === "teal" ? "text-[#0f766e]" : "text-[#3b82f6]"

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-[#e5e7eb] hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-[#111827] mb-3">{feature.title}</h3>
                <p className="text-[#4b5563] leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
