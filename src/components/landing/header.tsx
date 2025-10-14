import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pill } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-[#e5e7eb] bg-[#ffffff]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f766e]">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-[#111827]">Pharmy</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-[#4b5563] hover:text-[#111827] transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-[#4b5563] hover:text-[#111827] transition-colors">
              Pricing
            </Link>
            <Link href="/reviews" className="text-sm text-[#4b5563] hover:text-[#111827] transition-colors">
              Reviews
            </Link>
            <Link href="/faq" className="text-sm text-[#4b5563] hover:text-[#111827] transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-sm font-medium text-[#111827]">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm text-[#4b5563] hover:text-[#111827]">
              Sign In
            </Button>
            <Button className="bg-[#0f766e] text-white hover:bg-[#0f766e]/90">Book Demo</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
