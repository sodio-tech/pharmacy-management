"use client"

import { useState } from "react"
import { useUser } from "@/contexts/UserContext"
import { useBranches } from "./hooks/useBranches"
import OrganizationDetails from "./organization/OrganizationDetails"
import OrganizationOverview from "./organization/OrganizationOverview"
import RolePermissions from "./organization/RolePermissions"
import BranchManagement from "./organization/BranchManagement"
import AddBranchDialog from "./organization/AddBranchDialog"
import AddEmployeeDialog from "./organization/AddEmployeeDialog"
import type { Branch } from "./organization.types"

export default function Organization() {
  const { user: sessionUser } = useUser()
  const { branches, isLoading, fetchBranches } = useBranches(sessionUser?.pharmacy_id)
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)

  const handleBranchSuccess = (branch: Branch) => {
    fetchBranches()
  }

  const handleEmployeeSuccess = () => {
    setSelectedBranchId(null)
        fetchBranches()
  }

  const handleAddEmployee = (branchId: number) => {
    setSelectedBranchId(branchId)
    setIsAddEmployeeOpen(true)
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Organization Details and Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <OrganizationDetails />
        <OrganizationOverview />
      </div>

      <RolePermissions />

      <BranchManagement
        branches={branches}
        isLoading={isLoading}
        onAddBranch={() => setIsAddBranchOpen(true)}
        onAddEmployee={handleAddEmployee}
      />

      <AddBranchDialog
        open={isAddBranchOpen}
        onOpenChange={setIsAddBranchOpen}
        pharmacyId={sessionUser?.pharmacy_id}
        onSuccess={handleBranchSuccess}
      />

      <AddEmployeeDialog
        open={isAddEmployeeOpen}
        onOpenChange={setIsAddEmployeeOpen}
        pharmacyId={sessionUser?.pharmacy_id}
        selectedBranchId={selectedBranchId}
        onSuccess={handleEmployeeSuccess}
      />
    </div>
  )
}
