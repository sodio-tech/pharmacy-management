import { X, Check } from "lucide-react"

const challenges = [
  {
    title: "Manual Stock Updates",
    description: "Time-consuming inventory tracking leads to stockouts and overstocking",
  },
  {
    title: "Misplaced Prescriptions",
    description: "Paper-based systems result in lost prescriptions and customer frustration",
  },
  {
    title: "Billing Complexity",
    description: "Multiple payment modes and tax compliance create operational headaches",
  },
]

const solutions = [
  {
    title: "AI-Powered Automation",
    description: "Intelligent inventory management with predictive analytics and automated reordering",
  },
  {
    title: "Digital Prescription Management",
    description: "OCR scanning and secure digital storage for all prescriptions",
  },
  {
    title: "Integrated Billing System",
    description: "Seamless POS integration with automatic tax calculations and compliance",
  },
]

export function ChallengeSolution() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-8">The Pharmacy Management Challenge</h2>
            <div className="space-y-6">
              {challenges.map((challenge, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#fee2e2] flex items-center justify-center">
                      <X className="w-4 h-4 text-[#ef4444]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#111827] mb-1">{challenge.title}</h3>
                    <p className="text-[#4b5563] leading-relaxed">{challenge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-8">The Pharmy Solution</h2>
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#0f766e]/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#0f766e]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#111827] mb-1">{solution.title}</h3>
                    <p className="text-[#4b5563] leading-relaxed">{solution.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
