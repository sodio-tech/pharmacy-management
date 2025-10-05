import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"
import { UserStats } from "./user-stats"
import { UserTable } from "./user-table"
import { RoleManagement } from "./role-management"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

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
  return (
    <LayoutSkeleton
      header={
        <DynamicHeader
          maintext="User Management"
          para="Manage user accounts, roles, and permissions across the system"
          children={
            <div className="flex items-center gap-3">
              <Button className="bg-[#0f766e] hover:bg-[#0d6660] text-white gap-2">
                <Users className="w-4 h-4" />
                Add User
              </Button>
            </div>
          }
        />
      }
    >
      <UserManagementContent />
    </LayoutSkeleton>
  )
}
