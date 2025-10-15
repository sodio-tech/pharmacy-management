import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { TermsHero } from "@/components/landing/terms/terms-hero"
import { TermsIntroduction } from "@/components/landing/terms/terms-introduction"
import { TermsEligibility } from "@/components/landing/terms/terms-eligibility"
import { TermsServices } from "@/components/landing/terms/terms-services"
import { TermsResponsibilities } from "@/components/landing/terms/terms-responsibilities"
import { TermsPayment } from "@/components/landing/terms/terms-payment"
import { TermsDataPrivacy } from "@/components/landing/terms/terms-data-privacy"
import { TermsIntellectualProperty } from "@/components/landing/terms/terms-intellectual-property"
import { TermsThirdParty } from "@/components/landing/terms/terms-third-party"
import { TermsLiability } from "@/components/landing/terms/terms-liability"
import { TermsAvailability } from "@/components/landing/terms/terms-availability"
import { TermsTermination } from "@/components/landing/terms/terms-termination"
import { TermsGoverningLaw } from "@/components/landing/terms/terms-governing-law"
import { TermsChanges } from "@/components/landing/terms/terms-changes"
import { TermsContact } from "@/components/landing/terms/terms-contact"
import { TermsCta } from "@/components/landing/terms/terms-cta"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <TermsHero />
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
          <TermsIntroduction />
          <TermsEligibility />
          <TermsServices />
          <TermsResponsibilities />
          <TermsPayment />
          <TermsDataPrivacy />
          <TermsIntellectualProperty />
          <TermsThirdParty />
          <TermsLiability />
          <TermsAvailability />
          <TermsTermination />
          <TermsGoverningLaw />
          <TermsChanges />
          <TermsContact />
        </div>
      </main>
      <TermsCta />
      <Footer />
    </div>
  )
}
