"use client"

import { Suspense } from "react"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"
import { UserStats } from "./user-stats"
import { UserTable } from "./user-table"
import { RoleManagement } from "./role-management"
import { LoadingFallback } from "@/components/loading-fallback"
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
