import { Button } from "@/components/ui/button"

export function PrivacyCta() {
  return (
    <section className="py-20 px-6 bg-[#0f766e]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Data, Your Trust</h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Pharmy is built with privacy and security at its core. We'll always keep your information safe.
        </p>
        <Button size="lg" className="bg-white text-[#0f766e] hover:bg-white/90 font-semibold">
          Get Started Securely
        </Button>
      </div>
    </section>
  )
}
