"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pill } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/privacy", label: "Privacy" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

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
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm transition-colors",
                    isActive
                      ? "text-[#0f766e] font-medium"
                      : "text-[#4b5563] hover:text-[#111827]"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm text-[#4b5563] hover:text-[#111827]">
              <Link href="/login">  Sign In</Link>

            </Button>
            <Button className="bg-[#0f766e] text-white hover:bg-[#0f766e]/90">Book Demo</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
