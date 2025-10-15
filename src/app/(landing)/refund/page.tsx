import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { RefundHero } from "@/components/landing/refund/refund-hero"
import { ImportantInfo } from "@/components/landing/refund/important-info"
import { FreeTrialPolicy } from "@/components/landing/refund/free-trial-policy"
import { RefundPolicySection } from "@/components/landing/refund/refund-policy-section"
import { CancellationPolicySection } from "@/components/landing/refund/cancellation-policy-section"
import { RenewalPlanChanges } from "@/components/landing/refund/renewal-plan-changes"
import { NonRefundableItems } from "@/components/landing/refund/non-refundable-items"
import { BillingSupport } from "@/components/landing/refund/billing-support"
import { RefundCta } from "@/components/landing/refund/refund-cta"

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <RefundHero />
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <ImportantInfo />
          <FreeTrialPolicy />
          <RefundPolicySection />
          <CancellationPolicySection />
          <RenewalPlanChanges />
          <NonRefundableItems />
          <BillingSupport />
        </div>
        <RefundCta />
      </main>
      <Footer />                
    </div>
  )
}
