"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, Shield, User, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

const roles = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access and control",
    icon: Shield,
    color: "bg-[#f3e8ff] text-[#9333ea]",
    key: "admin_count" as keyof UserManagementData,
  },
  {
    id: 2,
    name: "Pharmacist",
    description: "Limited access for daily operations",
    icon: User,
    color: "bg-[#ccfbf1] text-[#0f766e]",
    key: "pharmacist_count" as keyof UserManagementData,
  },
  {
    id: 3,
    name: "Manager",
    description: "Branch management and reporting",
    icon: Users,
    color: "bg-[#dbeafe] text-[#2563eb]",
    key: null,
  },
]

const permissions = [
  { module: "Inventory Management", admin: true, pharmacist: true },
  { module: "Sales & Billing", admin: true, pharmacist: true },
  { module: "User Management", admin: true, pharmacist: false },
  // { module: "Reports & Analytics", admin: true, pharmacist: false },
  // { module: "Compliance", admin: true, pharmacist: false },
  // { module: "System Settings", admin: true, pharmacist: false },
]

export function RoleManagement() {
  const [userData, setUserData] = useState<UserManagementData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserManagementData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await backendApi.get("/v1/org/user-management")

      if (response.data?.success && response.data?.data) {
        setUserData(response.data.data)
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setUserData(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserManagementData()
  }, [fetchUserManagementData])

  const getUserCount = (role: typeof roles[0]): number => {
    if (!userData) return 0
    if (role.key && userData[role.key] !== undefined) {
      return userData[role.key] as number
    }
    // For Manager role, calculate as total - admin - pharmacist
    if (role.id === 3) {
      return Math.max(0, userData.total_users - userData.admin_count - userData.pharmacist_count)
    }
    return 0
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      {/* Role Management */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h3 className="text-lg font-semibold text-[#111827]">Role Management</h3>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const IconComponent = role.icon
            const userCount = getUserCount(role)
            return (
              <div
                key={role.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${role.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-[#111827]">{role.name}</h4>
                    <p className="text-sm text-[#6b7280] break-words">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <Badge variant="outline" className="text-[#0f766e] border-[#0f766e] whitespace-nowrap">
                    {isLoading ? "..." : `${userCount} Users`}
                  </Badge>
                  <Button variant="ghost" size="sm" aria-label={`Edit ${role.name} role`}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h3 className="text-lg font-semibold text-[#111827]">Permission Matrix</h3>
          <Button
            variant="outline"
            className="text-[#0f766e] border-[#0f766e] hover:bg-[#ccfbf1] bg-transparent w-full sm:w-auto"
          >
            Edit Permissions
          </Button>
        </div>

        <div className="space-y-4">
          {permissions.map((permission, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-[#e5e7eb] last:border-b-0"
            >
              <span className="text-sm font-medium text-[#111827] break-words">{permission.module}</span>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${permission.admin ? "bg-[#9333ea]" : "bg-[#d1d5db]"}`}
                  />
                  <span className="text-xs text-[#6b7280] whitespace-nowrap">Admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${permission.pharmacist ? "bg-[#0f766e]" : "bg-[#d1d5db]"}`}
                  />
                  <span className="text-xs text-[#6b7280] whitespace-nowrap">Pharmacist</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
