"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"
import { useAppDispatch } from "@/store/hooks"
import { setBranches } from "@/store/slices/branchSlice"
import { useUser } from "@/contexts/UserContext"
import type { Branch } from "../organization.types"
import type { Branch as ReduxBranch } from "@/hooks/useBranches"

interface EditBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch: Branch | null
  onSuccess?: () => void
}

interface BranchFormData {
  branch_name: string
  branch_location: string
  drug_license_number: string
  drug_license_expiry: string
  trade_license_number: string
  trade_license_expiry: string
  fire_certificate_number: string
  fire_certificate_expiry: string
}

interface BranchDetailsResponse {
  success: boolean
  message: string
  data: {
    id: number
    pharmacy_id: number
    branch_name: string
    branch_location: string
    drug_license_number: string
    drug_license_expiry: string
    trade_license_number: string
    trade_license_expiry: string
    fire_certificate_number: string
    fire_certificate_expiry: string
  }
}

// Helper function to convert ISO date string to YYYY-MM-DD format
const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  } catch {
    return ""
  }
}

export default function EditBranchDialog({
  open,
  onOpenChange,
  branch,
  onSuccess,
}: EditBranchDialogProps) {
  const { user } = useUser()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [formData, setFormData] = useState<BranchFormData>({
    branch_name: "",
    branch_location: "",
    drug_license_number: "",
    drug_license_expiry: "",
    trade_license_number: "",
    trade_license_expiry: "",
    fire_certificate_number: "",
    fire_certificate_expiry: "",
  })

  // Fetch branch details when dialog opens
  useEffect(() => {
    const fetchBranchDetails = async () => {
      if (!branch || !open) {
        return
      }

      setIsFetching(true)
      try {
        const response = await backendApi.get<BranchDetailsResponse>(
          `/v1/org/branch/details/${branch.id}`
        )

        if (response.data.success && response.data.data) {
          const data = response.data.data
          setFormData({
            branch_name: data.branch_name || "",
            branch_location: data.branch_location || "",
            drug_license_number: data.drug_license_number || "",
            drug_license_expiry: formatDateForInput(data.drug_license_expiry),
            trade_license_number: data.trade_license_number || "",
            trade_license_expiry: formatDateForInput(data.trade_license_expiry),
            fire_certificate_number: data.fire_certificate_number || "",
            fire_certificate_expiry: formatDateForInput(data.fire_certificate_expiry),
          })
        } else {
          toast.error(response.data.message || "Failed to fetch branch details")
        }
      } catch (error: any) {
        console.error("Error fetching branch details:", error)
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch branch details. Please try again."
        toast.error(errorMessage)
      } finally {
        setIsFetching(false)
      }
    }

    fetchBranchDetails()
  }, [branch, open])

  const handleInputChange = (field: keyof BranchFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!branch) {
      toast.error("Branch information is missing")
      return
    }

    setIsLoading(true)
    try {
      // Prepare data with dates in YYYY-MM-DD format
      const updateData = {
        branch_name: formData.branch_name,
        branch_location: formData.branch_location,
        drug_license_number: formData.drug_license_number,
        drug_license_expiry: formData.drug_license_expiry || null,
        trade_license_number: formData.trade_license_number,
        trade_license_expiry: formData.trade_license_expiry || null,
        fire_certificate_number: formData.fire_certificate_number,
        fire_certificate_expiry: formData.fire_certificate_expiry || null,
      }

      const response = await backendApi.put(
        `/v1/org/branch/details/${branch.id}`,
        updateData
      )

      if (response.data.success) {
        toast.success(response.data.message || "Branch updated successfully!")
        
        // Refetch branches at both places (Organization component and Redux/Sidebar)
        if (user?.pharmacy_id) {
          try {
            const branchesResponse = await backendApi.get(`/v1/org/branches/${user.pharmacy_id}`)
            
            if (branchesResponse.data.success) {
              const fetchedBranches = branchesResponse.data.data.branches || []
              // Update Redux store so Sidebar updates
              const reduxBranches: ReduxBranch[] = fetchedBranches.map((b: Branch) => ({
                id: b.id,
                branch_name: b.branch_name,
                branch_location: b.branch_location,
                drug_license_number: b.drug_license_number,
              }))
              dispatch(setBranches(reduxBranches))
            }
          } catch (error) {
            console.error("Error fetching branches after update:", error)
          }
        }
        
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast.error(response.data.message || "Failed to update branch")
      }
    } catch (error: any) {
      console.error("Error updating branch:", error)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update branch. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!branch) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Branch Details</DialogTitle>
          <DialogDescription>Update the branch information and license details</DialogDescription>
        </DialogHeader>
        {isFetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Loading branch details...</span>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="branch_name">Branch Name</Label>
            <Input
              id="branch_name"
              value={formData.branch_name}
              onChange={(e) => handleInputChange("branch_name", e.target.value)}
              disabled={isLoading || isFetching}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="branch_location">Branch Location</Label>
            <Input
              id="branch_location"
              value={formData.branch_location}
              onChange={(e) => handleInputChange("branch_location", e.target.value)}
              disabled={isLoading || isFetching}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="drug_license_number">Drug License Number</Label>
              <Input
                id="drug_license_number"
                value={formData.drug_license_number}
                onChange={(e) => handleInputChange("drug_license_number", e.target.value)}
                disabled={isLoading || isFetching}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="drug_license_expiry">Drug License Expiry</Label>
              <Input
                id="drug_license_expiry"
                type="date"
                value={formData.drug_license_expiry}
                onChange={(e) => handleInputChange("drug_license_expiry", e.target.value)}
                disabled={isLoading || isFetching}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="trade_license_number">Trade License Number</Label>
              <Input
                id="trade_license_number"
                value={formData.trade_license_number}
                onChange={(e) => handleInputChange("trade_license_number", e.target.value)}
                disabled={isLoading || isFetching}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trade_license_expiry">Trade License Expiry</Label>
              <Input
                id="trade_license_expiry"
                type="date"
                value={formData.trade_license_expiry}
                onChange={(e) => handleInputChange("trade_license_expiry", e.target.value)}
                disabled={isLoading || isFetching}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fire_certificate_number">Fire Certificate Number</Label>
              <Input
                id="fire_certificate_number"
                value={formData.fire_certificate_number}
                onChange={(e) => handleInputChange("fire_certificate_number", e.target.value)}
                disabled={isLoading || isFetching}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fire_certificate_expiry">Fire Certificate Expiry</Label>
              <Input
                id="fire_certificate_expiry"
                type="date"
                value={formData.fire_certificate_expiry}
                onChange={(e) => handleInputChange("fire_certificate_expiry", e.target.value)}
                disabled={isLoading || isFetching}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading || isFetching}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading || isFetching} className="bg-[#0f766e] hover:bg-[#0d6860] text-white">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

