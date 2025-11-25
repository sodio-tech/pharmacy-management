"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect } from "react"
import { User, Shield, CreditCard, Building2 } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import Profile from "./Profile"
import Security from "./Security"
import Organization from "./Organization"
import Subscription from "./Subscription"
import { cn } from "@/lib/utils"
import { LoadingFallback } from "@/components/loading-fallback"

type TabType = "profile" | "security" | "subscription" | "organization"

export default function ProfileContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  const activeTab = (searchParams.get("tab") as TabType) || "profile"
  const isPharmacist = user?.role === "PHARMACIST"

  const allTabs = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    // { id: "security" as TabType, label: "Security", icon: Shield },
    // { id: "subscription" as TabType, label: "Subscription", icon: CreditCard },
    { id: "organization" as TabType, label: "Organization", icon: Building2 },
  ]

  // Filter tabs based on user role
  const tabs = isPharmacist
    ? allTabs.filter((tab) => tab.id === "profile")
    : allTabs

  // Redirect to profile if pharmacist tries to access restricted tabs
  useEffect(() => {
    if (isPharmacist && activeTab !== "profile") {
      router.replace("?tab=profile")
    }
  }, [isPharmacist, activeTab, router])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tabs Navigation - Hidden for pharmacists */}
      {!isPharmacist && (
        <div className="border-b border-[#e5e7eb] -mx-6">
          <div className="overflow-x-auto scrollbar-hide px-6">
            <div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-8 min-w-max md:min-w-0">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => router.push(`?tab=${tab.id}`)}
                    className={`flex items-center gap-2 py-4 px-5 cursor-pointer sm:px-3 md:px-0 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                        ? "border-[#0f766e] text-[#0f766e]"
                        : "border-transparent text-[#6b7280] hover:text-[#374151]"
                      }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Profile Content */}
      {activeTab === "profile" &&
          <Suspense fallback={<LoadingFallback />}> 
          <div className={cn("mt-6", isPharmacist && "mt-0")}>
            <Profile />
          </div>
        </Suspense>
      }
      {!isPharmacist && activeTab === "security" && <Suspense fallback={<LoadingFallback />}> <Security /> </Suspense>}
      {!isPharmacist && activeTab === "subscription" && <Suspense fallback={<LoadingFallback />}> <Subscription /> </Suspense>}
      {!isPharmacist && activeTab === "organization" && <Suspense fallback={<LoadingFallback />}> <Organization /> </Suspense>}
    </div>
  )
}
