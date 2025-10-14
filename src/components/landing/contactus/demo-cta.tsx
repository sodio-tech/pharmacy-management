import { Button } from "@/components/ui/button"

export function DemoCta() {
  return (
    <section className="py-16 md:py-24 bg-[#0f766e]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Want to See Pharmy in Action?</h2>
        <p className="text-base text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Schedule a personalized demo and discover how Pharmy can transform your pharmacy operations
        </p>
        <Button className="bg-white text-[#0f766e] hover:bg-white/90 h-12 px-8 font-medium">Book a Demo</Button>
      </div>
    </section>
  )
}
