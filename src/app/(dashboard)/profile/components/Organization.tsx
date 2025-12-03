"use client"

import { useState, useRef } from "react"
import { useUser } from "@/contexts/UserContext"
import { useBranches } from "./hooks/useBranches"
import { useAppDispatch } from "@/store/hooks"
import { setBranches } from "@/store/slices/branchSlice"
import { backendApi } from "@/lib/axios-config"
import type { Branch as ReduxBranch } from "@/hooks/useBranches"
import OrganizationDetails from "./organization/OrganizationDetails"
import OrganizationOverview, { type OrganizationOverviewRef } from "./organization/OrganizationOverview"
import RolePermissions from "./organization/RolePermissions"
import BranchManagement from "./organization/BranchManagement"
import AddBranchDialog from "./organization/AddBranchDialog"
import AddEmployeeDialog from "./organization/AddEmployeeDialog"
import type { Branch } from "./organization.types"

export default function Organization() {
  const { user: sessionUser } = useUser()
  const { branches, isLoading, fetchBranches } = useBranches(sessionUser?.pharmacy_id)
  const dispatch = useAppDispatch()
  const overviewRef = useRef<OrganizationOverviewRef>(null)
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)

  const handleBranchSuccess = async () => {
    // Fetch all branches after creation and update Redux store
    if (!sessionUser?.pharmacy_id) return
    
    try {
      const response = await backendApi.get(`/v1/org/branches/${sessionUser.pharmacy_id}`)
      
      if (response.data.success) {
        const fetchedBranches = response.data.data.branches || []
        // Update local state
        fetchBranches()
        // Update Redux store immediately so Sidebar updates
        const reduxBranches: ReduxBranch[] = fetchedBranches.map((branch: Branch) => ({
          id: branch.id,
          branch_name: branch.branch_name,
          branch_location: branch.branch_location,
          drug_license_number: branch.drug_license_number,
        }))
        dispatch(setBranches(reduxBranches))
      }
    } catch (error) {
      console.error("Error fetching branches:", error)
      // Still try to refetch using the hook
      fetchBranches()
    } finally {
      // Refetch organization overview to update branch count
      overviewRef.current?.refetch()
    }
  }

  const handleEmployeeSuccess = () => {
    setSelectedBranchId(null)
    fetchBranches()
    // Refetch organization overview to update stats
    overviewRef.current?.refetch()
  }

  const handleBranchUpdate = async () => {
    // Refetch branches in Organization component
    fetchBranches()
    // Also update Redux store
    if (sessionUser?.pharmacy_id) {
      try {
        const response = await backendApi.get(`/v1/org/branches/${sessionUser.pharmacy_id}`)
        if (response.data.success) {
          const fetchedBranches = response.data.data.branches || []
          const reduxBranches: ReduxBranch[] = fetchedBranches.map((branch: Branch) => ({
            id: branch.id,
            branch_name: branch.branch_name,
            branch_location: branch.branch_location,
            drug_license_number: branch.drug_license_number,
          }))
          dispatch(setBranches(reduxBranches))
        }
      } catch (error) {
        console.error("Error fetching branches after update:", error)
      }
    }
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
        <OrganizationOverview ref={overviewRef} />
      </div>

      <RolePermissions />

      <BranchManagement
        branches={branches}
        isLoading={isLoading}
        onAddBranch={() => setIsAddBranchOpen(true)}
        onAddEmployee={handleAddEmployee}
        onBranchUpdate={handleBranchUpdate}
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
