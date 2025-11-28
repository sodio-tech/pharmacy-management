"use client"
import type React from "react"
import AdminSidebar from "@/components/AdminSidebar"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { LoadingFallback } from "@/components/loading-fallback"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex bg-[#f9fafb] overflow-hidden">
      <AdminSidebar isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="lg:hidden fixed top-4 left-4 z-30">
          <Button
            variant="outline"
            size="icon"
            className="bg-white shadow-md"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        <Suspense fallback={<LoadingFallback fullHeight />}>
          {children}
        </Suspense>
      </div>
    </div>
  )
}

