import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { LandingHero } from "@/components/landing/main/landing-hero"
import { FeaturesGrid } from "@/components/landing/main/features-grid"
import { ChallengeSolution } from "@/components/landing/main/challenge-solution"
import { AIFeatures } from "@/components/landing/main/ai-features"
import { Testimonials } from "@/components/landing/main/testimonials"
import { PricingSection } from "@/components/landing/main/pricing-section"
import { FAQSection } from "@/components/landing/main/faq-section"
import { FinalCTA } from "@/components/landing/main/final-cta"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LandingHero />
        <FeaturesGrid />
        <ChallengeSolution />
        <AIFeatures />
        <Testimonials />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
