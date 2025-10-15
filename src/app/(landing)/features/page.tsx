import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { FeaturesHero } from "@/components/landing/features/features-hero"
import { FeaturesIntro } from "@/components/landing/features/features-intro"
import { UserAccessFeature } from "@/components/landing/features/user-access-feature"
import { InventoryFeature } from "@/components/landing/features/inventory-feature"
import { PrescriptionFeature } from "@/components/landing/features/prescription-feature"
import { SalesBillingFeature } from "@/components/landing/features/sales-billing-feature"
import { AiIntelligence } from "@/components/landing/features/ai-intelligence"
import { CompleteFeatureSuite } from "@/components/landing/features/complete-feature-suite"
import { WhyChoosePharmy } from "@/components/landing/features/why-choose-pharmy"
import { FeaturesCta } from "@/components/landing/features/features-cta"

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[#ffffff]">
            <Header />
            <main>
                <FeaturesHero />
                <FeaturesIntro />
                <UserAccessFeature />
                <InventoryFeature />
                <PrescriptionFeature />
                <SalesBillingFeature />
                <AiIntelligence />
                <CompleteFeatureSuite />
                <WhyChoosePharmy />
                <FeaturesCta />
            </main>
            <Footer />
        </div>
    )
}
