import { GetStartedFreeButton } from "../get-started-free-button"

export function FinalCTA() {
  return (
    <section className="py-20 px-4 bg-[#0f766e] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Take your pharmacy to the next level with Pharmy</h2>
        <p className="text-xl text-white/90 mb-8 leading-relaxed">
          Join thousands of pharmacies already using Pharmy to streamline their operations
        </p>
        <GetStartedFreeButton className="bg-white text-[#0f766e] hover:bg-gray-100 font-semibold px-8 py-6 text-base" />
      </div>
    </section>
  )
}
