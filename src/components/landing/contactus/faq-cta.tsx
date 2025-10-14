import { Button } from "@/components/ui/button"

export function FaqCta() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Looking for Quick Answers?</h2>
        <p className="text-base text-[#4b5563] mb-8 max-w-2xl mx-auto">
          Check out our frequently asked questions for instant answers to common queries about Pharmy.
        </p>
        <Button className="bg-[#0f766e] text-white hover:bg-[#0f766e]/90 h-12 px-8">Visit FAQ Page</Button>
      </div>
    </section>
  )
}
