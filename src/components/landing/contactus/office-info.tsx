import { MapPin, Phone, Clock } from "lucide-react"
import Image from "next/image"

export function OfficeInfo() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-8">Visit Our Office</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e5e7eb] flex-shrink-0">
                <MapPin className="h-5 w-5 text-[#0f766e]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111827] mb-1">Global Headquarters</h3>
                <p className="text-sm text-[#4b5563]">India</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e5e7eb] flex-shrink-0">
                <Phone className="h-5 w-5 text-[#0f766e]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111827] mb-1">Phone Number</h3>
                <p className="text-sm text-[#4b5563]">+91 97400-54821</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e5e7eb] flex-shrink-0">
                <Clock className="h-5 w-5 text-[#0f766e]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111827] mb-1">Business Hours</h3>
                <p className="text-sm text-[#4b5563]">Monday - Friday 9:00</p>
                <p className="text-sm text-[#4b5563]">AM – 6:00 PM IST</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-[#e5e7eb] rounded-lg overflow-hidden h-64 lg:h-80 relative">
            <Image
              src="/office.jpg" 
              alt="Office location map" 
              fill
              className="object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  )
}
