"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"
import { UserStats } from "./user-stats"
import { UserTable } from "./user-table"
import { RoleManagement } from "./role-management"
import { LoadingFallback } from "@/components/loading-fallback"
import { useUser } from "@/contexts/UserContext"
import { Shield, AlertCircle } from "lucide-react"
// import { Users } from "lucide-react"
// import { HeaderActions, HeaderAction } from "@/components/HeaderActions"

function UserManagementContent() {
  return (
    <div className="bg-[#f9fafb] min-h-screen">

      <UserStats />
      <div className="mb-6">
        <UserTable />
      </div>
      <RoleManagement />
    </div>
  )
}

export default function UserManagement() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Check if user is loaded and not SUPER_ADMIN
    if (!isLoading && user && user.role !== "SUPER_ADMIN") {
      // Redirect to dashboard if not SUPER_ADMIN
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  // Show loading while checking user role
  if (isLoading) {
    return (
      <LayoutSkeleton
        header={
          <DynamicHeader
            maintext="User Management"
            para="Manage user accounts, roles, and permissions across the system"
          />
        }
      >
        <LoadingFallback />
      </LayoutSkeleton>
    )
  }

  // Block access if not SUPER_ADMIN
  if (user && user.role !== "SUPER_ADMIN") {
    return (
      <LayoutSkeleton
        header={
          <DynamicHeader
            maintext="Access Denied"
            para="You don't have permission to access this page"
          />
        }
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#f9fafb]">
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#fef2f2] flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#dc2626]" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-[#111827] mb-2">Access Denied</h2>
            <p className="text-[#6b7280] mb-6">
              User Management is only accessible to SUPER_ADMIN users.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-[#0f766e] text-white rounded-lg hover:bg-[#0d5d56] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </LayoutSkeleton>
    )
  }

  // const userActions: HeaderAction[] = [
  //   {
  //     label: "Add User",
  //     icon: Users,
  //     onClick: () => {},
  //     variant: 'primary'
  //   }
  // ]

  return (
    <LayoutSkeleton
      header={
        <DynamicHeader
          maintext="User Management"
          para="Manage user accounts, roles, and permissions across the system"
          // children={<HeaderActions actions={userActions} />}
        />
      }
    >
      <Suspense fallback={<LoadingFallback />}>
        <UserManagementContent />
      </Suspense>
    </LayoutSkeleton>
  )
}
