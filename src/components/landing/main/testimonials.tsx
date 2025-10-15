import Image from "next/image"

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    title: "MediCare Pharmacy",
    quote:
      "Pharmy reduced our stockouts by 40% and simplified billing across all our branches. The AI features are game-changing.",
    image: "/professional-woman-pharmacist.png",
  },
  {
    name: "Mike Chen",
    title: "HealthPlus Pharmacy",
    quote:
      "The prescription scanning feature saves us hours daily. Our customers love the faster service and accuracy.",
    image: "/professional-man-pharmacist.jpg",
  },
  {
    name: "Dr. Priya Patel",
    title: "Wellness Pharmacy Chain",
    quote: "Managing 12 branches was a nightmare before. Now everything is centralized and automated.",
    image: "/professional-woman-doctor.png",
  },
]

export function Testimonials() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">Trusted by Pharmacies Worldwide</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-[#e5e7eb] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-[#111827]">{testimonial.name}</h3>
                  <p className="text-sm text-[#4b5563]">{testimonial.title}</p>
                </div>
              </div>
              <p className="text-[#4b5563] leading-relaxed italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
