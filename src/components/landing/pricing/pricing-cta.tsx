import Link from "next/link"

export function PricingCta() {
  return (
    <section className="py-20 px-4 bg-[#0f766e]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#ffffff] mb-6">Ready to Simplify Your Pharmacy Management?</h2>
        <p className="text-lg text-[#ffffff]/90 mb-10 max-w-2xl mx-auto">
          Join thousands of pharmacies already using Pharmy to streamline operations and boost efficiency. Start your
          free trial today.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#"
            className="px-8 py-3 bg-[#ffffff] text-[#0f766e] rounded-lg font-semibold hover:bg-[#f9fafb] transition-colors"
          >
            Start Free Trial
          </Link>
          <Link
            href="#"
            className="px-8 py-3 bg-transparent text-[#ffffff] border-2 border-[#ffffff] rounded-lg font-semibold hover:bg-[#ffffff]/10 transition-colors"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </section>
  )
}
