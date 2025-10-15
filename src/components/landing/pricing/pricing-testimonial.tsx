import Image from "next/image"
import { Quote } from "lucide-react"

export function PricingTestimonial() {
  return (
    <section className="py-16 px-4 bg-[#f9fafb]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#ffffff] rounded-2xl p-12 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#e0f2f1] flex items-center justify-center">
              <Quote className="w-8 h-8 text-[#0f766e]" />
            </div>
          </div>

          <blockquote className="text-center mb-8">
            <p className="text-xl text-[#111827] leading-relaxed mb-6">
              "Pharmy made managing stock across 3 branches effortless. The AI features are a game-changer for our
              prescription processing and inventory forecasting."
            </p>
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            <Image
              src="/professional-woman-pharmacist.png"
              alt="Sarah Johnson"
              width={56}
              height={56}
              className="rounded-full"
            />
            <div className="text-left">
              <div className="font-semibold text-[#111827]">Sarah Johnson</div>
              <div className="text-sm text-[#4b5563]">Owner, MediCare Pharmacy Chain</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
