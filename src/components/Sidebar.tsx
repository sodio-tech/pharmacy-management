"use client"
import {
  Package,
  FileText,
  ShoppingCart,
  Users,
  BarChart3,
  Shield,
  LogOut,
  CreditCard,
  UserCheck,
  User,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import logo from "../../public/logo.png"
import { useUser } from "@/contexts/UserContext"
import { logout } from "@/lib/auth"
import { useState, useEffect } from "react"

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: FileText, label: "Prescriptions", href: "/prescriptions" },
  { icon: ShoppingCart, label: "Sales & POS", href: "/sales" },
  // { icon: Users, label: "Suppliers", href: "/suppliers" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Shield, label: "Compliance", href: "/compliance" },
  { icon: UserCheck, label: "User Management", href: "/users" },
  // { icon: CreditCard, label: "Subscription", href: "/profile?tab=subscription" },
  { icon: User, label: "Profile", href: "/profile" },
]

interface SidebarProps {
  isMobileMenuOpen?: boolean
  onCloseMobileMenu?: () => void
}

const Sidebar = ({ isMobileMenuOpen = false, onCloseMobileMenu }: SidebarProps) => {
  const { user, isLoading: isPending } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  const isPharmacist = user?.role === "PHARMACIST"

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false)
  }, [user?.id, user?.image, user?.profile_image])

  // Filter sidebar items based on user role
  const filteredSidebarItems = isPharmacist
    ? sidebarItems.filter((item) => item.label !== "Subscription")
    : sidebarItems

  const handleNavigation = (href: string) => {
    router.push(href)
    onCloseMobileMenu?.()
  }

  return (
    <>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onCloseMobileMenu} />}

      <div
        className={cn(
          "w-72 sm:w-64 bg-white border-r border-[#e5e7eb] flex flex-col",
          "fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="p-[22px] border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div>
                        <Image src={logo} alt="logo" width={45} height={45} />
                    </div>
              <div>
                <h1 className="font-semibold text-[#111827] text-lg">Pharmy</h1>
                <p className="text-xs text-[#6b7280]">Pharmacy Management System</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onCloseMobileMenu}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {filteredSidebarItems.map((item, index) => {
              const isDashboard = item.href === "/dashboard"
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/") || (pathname === "/" && isDashboard)
              return (
                <li key={index}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                      isActive ? "bg-[#0f766e] text-white" : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#e5e7eb] flex-shrink-0 bg-white/50">
          {isPending ? (
            <p className="text-sm text-[#6b7280]">Loading...</p>
          ) : user ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                {(user.image || user.profile_image) && !imageError ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#0f766e]">
                    <img
                      src={user.image || user.profile_image || ""}
                      alt={user.fullname || "Profile"}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0f766e] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {user.fullname
                        ? (() => {
                            const nameParts = user.fullname.trim().split(" ").filter(n => n.length > 0)
                            if (nameParts.length >= 2) {
                              // First letter of first name + first letter of last name
                              return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                            } else if (nameParts.length === 1) {
                              // If only one name, show first 2 letters
                              return nameParts[0].substring(0, 2).toUpperCase()
                            }
                            return "U"
                          })()
                        : "U"}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111827] text-sm truncate">{user.fullname || "Unknown User"}</p>
                  <p className="text-xs text-[#6b7280] truncate">{user.email || "No email"}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-[#6b7280] hover:text-[#111827] hover:bg-white"
                onClick={() => {
                  logout()
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" className="w-full" onClick={() => (window.location.href = "/login")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
