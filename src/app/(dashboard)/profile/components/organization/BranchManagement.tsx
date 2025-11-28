"use client"

import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import BranchCard from "./BranchCard"
import type { Branch } from "../organization.types"

interface BranchManagementProps {
  branches: Branch[]
  isLoading: boolean
  onAddBranch: () => void
  onAddEmployee: (branchId: number) => void
  onBranchUpdate?: () => void
}

export default function BranchManagement({
  branches,
  isLoading,
  onAddBranch,
  onAddEmployee,
  onBranchUpdate,
}: BranchManagementProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Branch Management</h2>
        <Button
          size="sm"
          className="bg-[#0f766e] hover:bg-[#0d6860] text-white"
          onClick={onAddBranch}
        >
          <Building2 className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading branches...</div>
        ) : branches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No branches found</div>
        ) : (
          branches.map((branch, index) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              index={index}
              onAddEmployee={onAddEmployee}
              onBranchUpdate={onBranchUpdate}
            />
          ))
        )}
      </div>
    </div>
  )
}

