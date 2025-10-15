import Image from "next/image"
import client1 from "../../../../public/assets/client1.png"
import client2 from "../../../../public/assets/client2.png"
import client3 from "../../../../public/assets/client3.png"

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    title: "MediCare Pharmacy",
    quote:
      "Pharmy reduced our stockouts by 40% and simplified billing across all our branches. The AI features are game-changing.",
    image: client3,
  },
  {
    name: "Mike Chen",
    title: "HealthPlus Pharmacy",
    quote:
      "The prescription scanning feature saves us hours daily. Our customers love the faster service and accuracy.",
    image: client2,
  },
  {
    name: "Dr. Priya Patel",
    title: "Wellness Pharmacy Chain",
    quote: "Managing 12 branches was a nightmare before. Now everything is centralized and automated.",
    image: client1,
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
                  src={testimonial.image}
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
