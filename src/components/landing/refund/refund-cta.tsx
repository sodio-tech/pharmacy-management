import { Button } from "@/components/ui/button"

export function RefundCta() {
  return (
    <section className="bg-[#0f766e] py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent, and Fair</h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          At Pharmy, we value your trust. Our policies are designed to keep things clear and hassle-free while
          protecting both our customers and our business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0f766e]"
          >
            Contact Billing Support
          </Button>
          <Button size="lg" className="bg-white text-[#0f766e] hover:bg-gray-100">
            Start Free Trial
          </Button>
        </div>
      </div>
    </section>
  )
}
