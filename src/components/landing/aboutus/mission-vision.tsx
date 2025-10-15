import { Target, Eye } from "lucide-react"

export function MissionVision() {
  return (
    <section className="py-16 bg-[#f9fafb]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Our Mission */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-[#0f766e]/10 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-[#0f766e]" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-4">Our Mission</h3>
            <p className="text-[#4b5563] leading-relaxed">
              To simplify pharmacy management through innovation, automation, and reliable technology. We're committed
              to helping pharmacies of all sizes operate more efficiently, reduce errors, and focus on what matters most
              — patient care.
            </p>
          </div>

          {/* Our Vision */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-[#3b82f6]" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-4">Our Vision</h3>
            <p className="text-[#4b5563] leading-relaxed">
              A world where every pharmacy — big or small — can run efficiently and provide better care to patients. We
              envision a future where technology seamlessly integrates with healthcare to create better outcomes for
              everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
