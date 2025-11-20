import Image from "next/image"
import pharmacy from "../../../../public/assets/about-landing.png"
import { GetStartedFreeButton } from "../get-started-free-button"
import { BookDemoButton } from "../book-demo-button"

export function AboutHero() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6 leading-tight">
              Empowering Pharmacies with <span className="text-[#0f766e]">Smarter Management</span>
            </h1>
            <p className="text-lg text-[#4b5563] mb-8 leading-relaxed">
              At Pharmy, our mission is simple: help pharmacies save time, reduce errors, and deliver better healthcare
              through technology.
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
                alt="Modern pharmacy with digital management displays"
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
