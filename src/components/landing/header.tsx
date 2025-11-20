"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import logo from "../../../public/logo.png"
import Image from "next/image"
import { BookDemoButton } from "./book-demo-button"

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="border-b border-[#e5e7eb] bg-[#ffffff]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f766e]">
              <Image src={logo} alt="logo" width={40} height={40} />
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
            <BookDemoButton variant="default" className="bg-[#0f766e] text-white hover:bg-[#0f766e]/90 px-4 py-2 text-sm border-0" />
          </div>
        </div>
      </div>
    </header>
  )
}
