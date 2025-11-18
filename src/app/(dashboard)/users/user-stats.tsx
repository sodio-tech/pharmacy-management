"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, UserCheck, Shield, Stethoscope } from "lucide-react"
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

export function UserStats() {
  const [userData, setUserData] = useState<UserManagementData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserManagementData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await backendApi.get("/v1/org/user-management")

      if (response.data?.success && response.data?.data) {
        setUserData(response.data.data)
      } else {
        toast.error("Failed to fetch user management data")
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || "Failed to fetch user management data")
      setUserData(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserManagementData()
  }, [fetchUserManagementData])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280]">Total Users</p>
            <p className="text-2xl font-bold text-[#111827]">
              {isLoading ? "..." : userData?.total_users ?? 0}
            </p>
            <p className="text-xs text-[#16a34a]">
              {userData?.newusers ? `+${userData.newusers} this month` : ""}
            </p>
          </div>
          <div className="w-12 h-12 bg-[#dbeafe] rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-[#2563eb]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280]">Active Users</p>
            <p className="text-2xl font-bold text-[#16a34a]">
              {isLoading ? "..." : userData?.active_users ?? 0}
            </p>
            <p className="text-xs text-[#6b7280]">Currently online</p>
          </div>
          <div className="w-12 h-12 bg-[#dcfce7] rounded-lg flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-[#16a34a]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280]">Administrators</p>
            <p className="text-2xl font-bold text-[#9333ea]">
              {isLoading ? "..." : userData?.admin_count ?? 0}
            </p>
            <p className="text-xs text-[#6b7280]">Full access</p>
          </div>
          <div className="w-12 h-12 bg-[#f3e8ff] rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#9333ea]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280]">Pharmacists</p>
            <p className="text-2xl font-bold text-[#0f766e]">
              {isLoading ? "..." : userData?.pharmacist_count ?? 0}
            </p>
            <p className="text-xs text-[#6b7280]">Limited access</p>
          </div>
          <div className="w-12 h-12 bg-[#ccfbf1] rounded-lg flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-[#0f766e]" />
          </div>
        </div>
      </div>
    </div>
  )
}
