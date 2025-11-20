import { GetStartedFreeButton } from "../get-started-free-button"
import { BookDemoButton } from "../book-demo-button"

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
          <GetStartedFreeButton className="bg-[#ffffff] text-[#0f766e] hover:bg-[#f9fafb] font-semibold px-8 py-3 text-base rounded-lg" />
          <BookDemoButton className="bg-transparent text-[#ffffff] border-2 border-[#ffffff] hover:bg-[#ffffff]/10 font-semibold px-8 py-3 text-base rounded-lg" />
        </div>
      </div>
    </section>
  )
}
