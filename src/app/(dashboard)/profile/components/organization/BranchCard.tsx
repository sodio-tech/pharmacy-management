"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Building2, UserPlus, Pencil } from "lucide-react"
import type { Branch } from "../organization.types"
import EditBranchDialog from "./EditBranchDialog"

interface BranchCardProps {
  branch: Branch
  index: number
  onAddEmployee: (branchId: number) => void
  onBranchUpdate?: () => void
}

export default function BranchCard({ branch, index, onAddEmployee, onBranchUpdate }: BranchCardProps) {
  const isPrimary = index === 0
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <div
      className={`p-4 rounded-lg border ${isPrimary ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isPrimary ? "bg-green-100" : "bg-gray-200"
            }`}
          >
            <Building2 className={`w-6 h-6 ${isPrimary ? "text-green-600" : "text-gray-600"}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900">{branch.branch_name}</div>
            <div className="text-sm text-gray-600 mt-0.5 break-words">{branch.branch_location}</div>
            <div className="text-xs text-gray-500 mt-2">License: {branch.drug_license_number}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap lg:flex-nowrap">
          <Button
            size="sm"
            variant="outline"
            className="border-gray-300 hover:bg-gray-100 bg-transparent"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-[#0f766e] border-[#0f766e] hover:bg-[#0f766e]/5 bg-transparent"
              onClick={() => onAddEmployee(branch.id)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>
      </div>
      <EditBranchDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        branch={branch}
        onSuccess={onBranchUpdate}
      />
    </div>
  )
}
