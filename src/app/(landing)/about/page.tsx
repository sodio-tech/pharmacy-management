import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { AboutHero } from "@/components/landing/aboutus/about-hero"
import { OurStory } from "@/components/landing/aboutus/our-story"
import { MissionVision } from "@/components/landing/aboutus/mission-vision"
import { WhatWeDo } from "@/components/landing/aboutus/what-we-do"
import { WhyChoose } from "@/components/landing/aboutus/why-choose"
import { AboutTestimonials } from "@/components/landing/aboutus/about-testimonials"
import { AboutCta } from "@/components/landing/aboutus/about-cta"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Header />
      <main>
        <AboutHero />
        <OurStory />
        <MissionVision />
        <WhatWeDo />
        <WhyChoose />
        <AboutTestimonials />
        <AboutCta />
      </main>
      <Footer />
    </div>
  )
}
