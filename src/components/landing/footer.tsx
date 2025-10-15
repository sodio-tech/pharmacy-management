import Link from "next/link"
import { Pill, Facebook, Twitter, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f766e]">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Pharmy</span>
            </Link>
            <p className="text-sm text-[#9ca3af] mb-4">
              An efficient pharmacy management solution for modern healthcare.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="text-[#9ca3af] hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[#9ca3af] hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[#9ca3af] hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[#9ca3af] hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-[#9ca3af] hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-[#9ca3af] hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#9ca3af] hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm text-[#9ca3af] hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-[#9ca3af] hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-[#9ca3af] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-[#9ca3af] hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm text-[#9ca3af] hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#374151] mt-8 pt-8 text-center">
          <p className="text-sm text-[#9ca3af]">© 2025 Biouchi Software Solutions</p>
          <p className="text-sm text-[#9ca3af]">Pharmy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
