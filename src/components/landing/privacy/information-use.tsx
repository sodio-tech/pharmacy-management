import { Settings, CheckCircle } from "lucide-react"

export default function InformationUse() {
  const uses = [
    "Provide and improve Pharmy services",
    "Manage pharmacy inventory, sales, and prescriptions",
    "Process billing and invoicing",
    "Send important updates and alerts",
    "Comply with legal obligations",
    "Provide analytics and AI-driven features",
    "Predictive stock forecasting",
    "Fraud detection and prevention",
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0f766e]/10 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#0f766e]" />
          </div>
          <h2 className="text-2xl font-bold">How We Use Your Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {uses.map((use, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
              <p className="text-[#4b5563]">{use}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
