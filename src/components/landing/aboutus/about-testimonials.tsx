import Image from "next/image"

export function AboutTestimonials() {
  const testimonials = [
    {
      name: "Dr. Priya Patel",
      title: "Wellness Pharmacy Chain",
      image: "/professional-woman-doctor.png",
      quote:
        "Pharmy has transformed the way we manage stock and prescriptions across our branches. It's a lifesaver for our daily operations and has significantly reduced our administrative burden.",
    },
    {
      name: "Mark Thompson",
      title: "Community Pharmacy Owner",
      image: "/professional-man-pharmacist.jpg",
      quote:
        "The AI-powered features are incredible. OCR prescription scanning alone saves us hours every day, and our customers appreciate the faster, more accurate service.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#111827] text-center mb-12">What Our Customers Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-[#e5e7eb]">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827] text-lg">{testimonial.name}</h3>
                  <p className="text-[#4b5563] text-sm">{testimonial.title}</p>
                </div>
              </div>
              <p className="text-[#374151] leading-relaxed">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
