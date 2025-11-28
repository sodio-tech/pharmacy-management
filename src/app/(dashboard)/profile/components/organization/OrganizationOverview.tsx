"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Building2, Users, UserCog, UserCheck, Loader2 } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"

interface UserManagementData {
  total_users: number
  branch_count: number
  admin_count: number
  pharmacist_count: number
  active_users: number
  newusers: number
}

interface ApiResponse {
  success: boolean
  message: string
  data: UserManagementData
}

export interface OrganizationOverviewRef {
  refetch: () => void
}

const OrganizationOverview = forwardRef<OrganizationOverviewRef>((props, ref) => {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    teamMembers: 0,
    branches: 0,
    admins: 0,
    pharmacists: 0,
  })

  const fetchUserManagement = async () => {
    setIsLoading(true)
    try {
      const response = await backendApi.get<ApiResponse>("/v1/org/user-management")
      
      if (response.data.success && response.data.data) {
        const data = response.data.data
        setStats({
          teamMembers: data.total_users || 0,
          branches: data.branch_count || 0,
          admins: data.admin_count || 0,
          pharmacists: data.pharmacist_count || 0,
        })
      }
    } catch (error) {
      console.error("Error fetching user management data:", error)
      toast.error("Failed to load organization overview")
    } finally {
      setIsLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    refetch: fetchUserManagement,
  }))

  useEffect(() => {
    fetchUserManagement()
  }, [])

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
      value: stats.branches,
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
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
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
      )}
    </div>
  )
})

OrganizationOverview.displayName = "OrganizationOverview"

export default OrganizationOverview

