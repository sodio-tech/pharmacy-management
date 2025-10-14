import { Card } from "@/components/ui/card"
import { Briefcase, Wrench, Mail } from "lucide-react"

const contactOptions = [
  {
    icon: Briefcase,
    title: "Sales Inquiries",
    description: "Interested in Pharmy? Our sales team can help you find the right plan for your pharmacy.",
    email: "contact@eodie.tech",
  },
  {
    icon: Wrench,
    title: "Support",
    description: "Need help with setup or features? Our support team is available 24/7 to assist you.",
    email: "contact@eodie.tech",
  },
  {
    icon: Mail,
    title: "General Questions",
    description: "Have a general question or feedback? We'd love to hear from you and help however we can.",
    email: "contact@eodie.tech",
  },
]

export function ContactCards() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactOptions.map((option) => (
            <Card key={option.title} className="p-6 text-center border-[#e5e7eb] hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e5e7eb]">
                  <option.icon className="h-6 w-6 text-[#0f766e]" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">{option.title}</h3>
              <p className="text-sm text-[#4b5563] mb-4 leading-relaxed">{option.description}</p>
              <a
                href={`mailto:${option.email}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#0f766e] hover:underline"
              >
                <Mail className="h-4 w-4" />
                {option.email}
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
