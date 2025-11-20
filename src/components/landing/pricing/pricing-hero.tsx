import Image from "next/image"
import pharmacy from "../../../../public/assets/pricing-landing.png"
import { GetStartedFreeButton } from "../get-started-free-button"
import { BookDemoButton } from "../book-demo-button"

export function PricingHero() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-bold text-[#111827] mb-6 leading-tight">
              Flexible <span className="text-[#0f766e]">Pricing</span> for Every Pharmacy
            </h1>
            <p className="text-lg text-[#4b5563] mb-8 leading-relaxed">
              Start for free and scale as you grow. Whether you run a single store or multiple branches, Pharmy has a
              plan for you.
            </p>
            <div className="flex flex-wrap gap-4">
              <GetStartedFreeButton />
              <BookDemoButton />
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src={pharmacy}
                alt="Pharmacy"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
