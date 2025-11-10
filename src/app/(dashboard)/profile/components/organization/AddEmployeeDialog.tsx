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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"
import backendApi from "@/lib/axios-config"
import type { EmployeeForm } from "../organization.types"

interface AddEmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pharmacyId?: number
  selectedBranchId: number | null
  onSuccess: () => void
}

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "PHARMACIST", label: "Pharmacist" },
] as const

export default function AddEmployeeDialog({
  open,
  onOpenChange,
  pharmacyId,
  selectedBranchId,
  onSuccess,
}: AddEmployeeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState<EmployeeForm>({
    pharmacy_id: pharmacyId,
    role: "ADMIN",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  })

  // Update form when pharmacyId changes
  useEffect(() => {
    if (pharmacyId) {
      setForm((prev) => ({ ...prev, pharmacy_id: pharmacyId }))
    }
  }, [pharmacyId])

  const resetForm = () => {
    setForm({
      pharmacy_id: pharmacyId,
      role: "ADMIN",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
    })
    setShowPassword(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedBranchId) {
      toast.error("Please select a branch to add an employee")
      return
    }

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
        branch_id: selectedBranchId,
      }
      const response = await backendApi.post(`/v1/org/add-employee`, submitData)

      if (response.data.success) {
        toast.success(response.data.message || "Employee added successfully")
        onSuccess()
        onOpenChange(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error adding employee:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            {selectedBranchId
              ? `Enter the details for the new employee for branch ID: ${selectedBranchId}`
              : "Enter the details for the new employee."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4 px-1 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="Enter first name"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Enter last name"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                placeholder="Enter phone number"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm({ ...form, role: value as EmployeeForm["role"] })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#0f766e] hover:bg-[#0d6860] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

