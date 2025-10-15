import { FaqCta } from '@/components/landing/contactus/faq-cta'
import { DemoCta } from '@/components/landing/contactus/demo-cta'
import { ContactCards } from '@/components/landing/contactus/contact-cards'
import React from 'react'
import { Header } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/contactus/hero-section'
import { OfficeInfo } from '@/components/landing/contactus/office-info'
import { ContactForm } from '@/components/landing/contactus/contact-form'
import { SocialMedia } from '@/components/landing/contactus/social-media'
import { Footer } from '@/components/landing/footer'

const page = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <ContactCards />
                <ContactForm />
                <OfficeInfo />
                <SocialMedia />
                <FaqCta />
                <DemoCta />
            </main>
            <Footer />
        </div>
    )
}

export default page