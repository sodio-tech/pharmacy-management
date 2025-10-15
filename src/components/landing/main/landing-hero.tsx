import { Button } from "@/components/ui/button"
import Image from "next/image"
import dashboardimage from "../../../../public/assets/pharmacy-dashboard-interface-with-metrics-and-char.jpg"

export function LandingHero() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] mb-6 leading-tight">
              Smarter, Simpler <span className="text-[#0f766e]">Pharmacy Management</span>
            </h1>
            <p className="text-lg text-[#4b5563] mb-8 leading-relaxed">
              Pharmy helps pharmacies streamline inventory, prescriptions, billing, suppliers, and compliance — all in
              one powerful app.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#0f766e] hover:bg-[#0f766e]/90 text-white px-6 py-6 text-base">
                Get Started Free
              </Button>
              <Button
                variant="outline"
                className="border-[#0f766e] text-[#0f766e] hover:bg-[#0f766e]/5 px-6 py-6 text-base bg-transparent"
              >
                Book a Demo
              </Button>
            </div>
          </div>
          <div className="relative">
          
              <Image
                src={dashboardimage}
                alt="Pharmacy Dashboard"
                width={700}
                height={500}
                className=" w-full"
              />
           
          </div>
        </div>
      </div>
    </section>
  )
}
