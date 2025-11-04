"use client"

import { useState, useEffect } from "react"
import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import backendApi from "@/lib/axios-config"
import type { BranchForm, Branch } from "../organization.types"

interface AddBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pharmacyId?: number
  onSuccess: (branch: Branch) => void
}

export default function AddBranchDialog({
  open,
  onOpenChange,
  pharmacyId,
  onSuccess,
}: AddBranchDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<BranchForm>({
    branch_name: "",
    branch_location: "",
    drug_license_number: "",
    pharmacy_id: pharmacyId,
  })

  // Update form when pharmacyId changes
  useEffect(() => {
    if (pharmacyId) {
      setForm((prev) => ({ ...prev, pharmacy_id: pharmacyId }))
    }
  }, [pharmacyId])

  const resetForm = () => {
    setForm({
      branch_name: "",
      branch_location: "",
      drug_license_number: "",
      pharmacy_id: pharmacyId,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate pharmacy_id
    if (!pharmacyId) {
      toast.error("Pharmacy ID is required. Please try again.")
      return
    }

    setIsLoading(true)

    try {
      const submitData = {
        ...form,
        pharmacy_id: pharmacyId, // Ensure pharmacy_id is always set
      }
      const response = await backendApi.post(`/v1/org/new-branch`, submitData)

      if (response.data.success) {
        toast.success(response.data.message || "Branch added successfully")
        onSuccess(response.data.data)
        onOpenChange(false)
        resetForm()
      } else {
        toast.error(response.data.message || "Failed to add branch")
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message
      toast.error(errorMessage || "Failed to add branch")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Branch</DialogTitle>
          <DialogDescription>Enter the details for the new branch location.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="branch_name">Branch Name</Label>
              <Input
                id="branch_name"
                placeholder="Enter branch name"
                value={form.branch_name}
                onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch_location">Branch Location</Label>
              <Input
                id="branch_location"
                placeholder="Enter branch location"
                value={form.branch_location}
                onChange={(e) => setForm({ ...form, branch_location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drug_license_number">Drug License Number</Label>
              <Input
                id="drug_license_number"
                placeholder="Enter drug license number"
                value={form.drug_license_number}
                onChange={(e) => setForm({ ...form, drug_license_number: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0f766e] hover:bg-[#0d6860] text-white" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Branch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

