import { Package, Check } from "lucide-react"
import Image from "next/image"
import feature from "../../../../public/assets/feature2.png"

export function InventoryFeature() {
  const features = [
    "Add, update, and delete medicines/products",
    "Batch & lot tracking with expiry management",
    "Real-time stock monitoring and alerts",
    "Barcode/QR code scanning integration",
    "Smart categorization (OTC, prescription, supplements)",
  ]

  return (
    <section className="py-16 md:py-24 bg-[#f9fafb]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative order-2 md:order-1">
            <div className="relative rounded-xl overflow-hidden shadow-xl border border-[#e5e7eb]">
              <Image
                src={feature}
                alt="Inventory management dashboard interface"
                width={700}
                height={500}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#3b82f6]/10 mb-6">
              <Package className="w-7 h-7 text-[#3b82f6]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Inventory & Stock Management</h2>
            <p className="text-lg text-[#4b5563] mb-6 leading-relaxed">
              Complete inventory control with real-time tracking, automated alerts, and intelligent reordering
              suggestions to prevent stockouts.
            </p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
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
