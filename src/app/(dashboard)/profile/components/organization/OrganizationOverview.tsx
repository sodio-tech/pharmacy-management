"use client"

import { Building2, Users, UserCog, UserCheck } from "lucide-react"
import type { OrganizationStats } from "../organization.types"

interface OrganizationOverviewProps {
  stats: OrganizationStats
  branchesCount: number
}

export default function OrganizationOverview({ stats, branchesCount }: OrganizationOverviewProps) {
  const overviewItems = [
    {
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Team Members",
      subtitle: "Active users",
      value: stats.teamMembers,
    },
    {
      icon: Building2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Branches",
      subtitle: "Active locations",
      value: branchesCount,
    },
    {
      icon: UserCog,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Admins",
      subtitle: "Full access",
      value: stats.admins,
    },
    {
      icon: UserCheck,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      title: "Pharmacists",
      subtitle: "Limited access",
      value: stats.pharmacists,
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Organization Overview</h2>
      <div className="space-y-4">
        {overviewItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.subtitle}</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

