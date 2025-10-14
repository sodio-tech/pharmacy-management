import { Linkedin, Twitter, Instagram, Facebook } from "lucide-react"
import Link from "next/link"

export function SocialMedia() {
  return (
    <section className="py-12 md:py-16 bg-[#f9fafb]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Follow Us on Social Media</h2>
        <p className="text-base text-[#4b5563] mb-8 max-w-2xl mx-auto">
          Stay updated with the latest Pharmy news and pharmacy management tips
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="#"
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0f766e] text-white hover:bg-[#0f766e]/90 transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#3b82f6] text-white hover:bg-[#3b82f6]/90 transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ec4899] text-white hover:bg-[#ec4899]/90 transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563eb] text-white hover:bg-[#2563eb]/90 transition-colors"
          >
            <Facebook className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
