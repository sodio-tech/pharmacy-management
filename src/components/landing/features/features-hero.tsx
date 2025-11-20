import Image from "next/image"
import doctor from "../../../../public/assets/doctor.png"
import { GetStartedFreeButton } from "../get-started-free-button"
import { BookDemoButton } from "../book-demo-button"

export function FeaturesHero() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6 leading-tight">
              Everything You Need to Run Your <span className="text-[#0f766e]">Pharmacy, Simplified</span>
            </h1>
            <p className="text-lg text-[#4b5563] mb-8 leading-relaxed">
              Pharmy brings together inventory, prescriptions, billing, suppliers, compliance, and analytics — into one
              powerful, easy-to-use platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <GetStartedFreeButton />
              <BookDemoButton />
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src={doctor}
                alt="Professional pharmacist with clipboard"
                width={600}
                height={700}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
