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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import backendApi from "@/lib/axios-config"

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

// Validation schema with user-friendly error messages
const employeeSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "First name is required" })
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "First name can only contain letters and spaces" }),
  last_name: z
    .string()
    .min(1, { message: "Last name is required" })
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Last name can only contain letters and spaces" }),
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" })
    .max(100, { message: "Email address cannot exceed 100 characters" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  phone_number: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits" }),
  role: z.enum(["ADMIN", "PHARMACIST"], {
    message: "Please select a role",
  }),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

export default function AddEmployeeDialog({
  open,
  onOpenChange,
  pharmacyId,
  selectedBranchId,
  onSuccess,
}: AddEmployeeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      role: "ADMIN",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
    },
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset()
      setShowPassword(false)
    }
  }, [open, form])

  // Update form when pharmacyId changes
  useEffect(() => {
    if (pharmacyId && open) {
      // Form is ready, no need to update form state directly
    }
  }, [pharmacyId, open])

  const onSubmit = async (data: EmployeeFormValues) => {
    // Validate branch selection
    if (!selectedBranchId) {
      toast.error("Please select a branch before adding an employee")
      form.setError("root", {
        message: "Branch selection is required",
      })
      return
    }

    // Validate pharmacy_id
    if (!pharmacyId) {
      toast.error("Pharmacy information is missing. Please refresh the page and try again.")
      form.setError("root", {
        message: "Pharmacy ID is required",
      })
      return
    }

    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        pharmacy_id: pharmacyId,
        branch_id: selectedBranchId,
      }

      const response = await backendApi.post(`/v1/org/add-employee`, submitData)

      if (response.data.success) {
        toast.success(response.data.message || "Employee added successfully!")
        onSuccess()
        onOpenChange(false)
        form.reset()
        setShowPassword(false)
      } else {
        toast.error(response.data.message || "Failed to add employee. Please try again.")
      }
    } catch (error: unknown) {
      console.error("Error adding employee:", error)
      const err = error as {
        response?: {
          data?: {
            message?: string
            error?: string
            errors?: Record<string, string[]>
          }
        }
        message?: string
      }

      // Handle validation errors from API
      if (err?.response?.data?.errors) {
        const apiErrors = err.response.data.errors
        Object.keys(apiErrors).forEach((field) => {
          const fieldName = field as keyof EmployeeFormValues
          if (apiErrors[field] && apiErrors[field][0]) {
            form.setError(fieldName, {
              type: "server",
              message: apiErrors[field][0],
            })
          }
        })
        toast.error("Please correct the errors in the form")
      } else {
        // Handle general API errors
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to add employee. Please check your connection and try again."
        toast.error(errorMessage)
        form.setError("root", {
          message: errorMessage,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const password = form.watch("password")

  // Password validation checks for UI feedback
  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /[0-9]/.test(password || ""),
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            {selectedBranchId
              ? `Enter the details for the new employee for the selected branch`
              : "Please select a branch first, then enter the employee details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4 px-1 max-h-[60vh] overflow-y-auto">
              {/* Root error message */}
              {form.formState.errors.root && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter first name"
                          {...field}
                          className={form.formState.errors.first_name ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter last name"
                          {...field}
                          className={form.formState.errors.last_name ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                        className={form.formState.errors.email ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                          className={`pr-10 ${form.formState.errors.password ? "border-red-500" : ""}`}
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
                    </FormControl>
                    <FormMessage />
                    {password && (
                      <div className="mt-2 space-y-1 text-xs">
                        <div className={`flex items-center gap-2 ${passwordChecks.length ? "text-green-600" : "text-gray-500"}`}>
                          <span>{passwordChecks.length ? "✓" : "○"}</span>
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? "text-green-600" : "text-gray-500"}`}>
                          <span>{passwordChecks.uppercase ? "✓" : "○"}</span>
                          <span>One uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordChecks.lowercase ? "text-green-600" : "text-gray-500"}`}>
                          <span>{passwordChecks.lowercase ? "✓" : "○"}</span>
                          <span>One lowercase letter</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordChecks.number ? "text-green-600" : "text-gray-500"}`}>
                          <span>{passwordChecks.number ? "✓" : "○"}</span>
                          <span>One number</span>
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 10-digit phone number"
                        {...field}
                        maxLength={10}
                        className={form.formState.errors.phone_number ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">Enter 10 digits without spaces or special characters</p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger className={form.formState.errors.role ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  form.reset()
                  setShowPassword(false)
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0f766e] hover:bg-[#0d6860] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Adding Employee..." : "Add Employee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

