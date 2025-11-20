import { GetStartedFreeButton } from "../get-started-free-button"

export function FeaturesCta() {
  return (
    <section className="py-20 px-6 bg-[#0f766e]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Run Your Pharmacy the Smart Way with Pharmy</h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of pharmacies already using Pharmy to streamline their operations and boost efficiency
        </p>
        <GetStartedFreeButton className="bg-white text-[#0f766e] hover:bg-white/90 font-semibold px-6 py-6 text-base" />
      </div>
    </section>
  )
}
