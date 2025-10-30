"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { User, Shield, CreditCard, Building2 } from "lucide-react"
import Profile from "./Profile"
import Security from "./Security"
import Organization from "./Organization"
import Subscription from "./Subscription"

type TabType = "profile" | "security" | "subscription" | "organization"

export default function ProfileContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = (searchParams.get("tab") as TabType) || "profile"

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "security" as TabType, label: "Security", icon: Shield },
    { id: "subscription" as TabType, label: "Subscription", icon: CreditCard },
    { id: "organization" as TabType, label: "Organization", icon: Building2 },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tabs Navigation */}
      <div className="border-b border-[#e5e7eb] -mx-6">
        <div className="overflow-x-auto scrollbar-hide px-6">
          <div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-8 min-w-max md:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push(`?tab=${tab.id}`)}
                  className={`flex items-center gap-2 py-4 px-5 sm:px-3 md:px-0 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
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

      {/* Profile Content */}
      {activeTab === "profile" && <Profile />}

      {activeTab === "security" && <Security />}
      {activeTab === "subscription" && <Subscription />}
      {activeTab === "organization" && <Organization />}
    </div>
  )
}
