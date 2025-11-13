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
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import backendApi from "@/lib/axios-config"
import type { Branch } from "../organization.types"

interface AddBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pharmacyId?: number
  onSuccess: (branch: Branch) => void
}

// Validation schema with user-friendly error messages
const branchSchema = z.object({
  branch_name: z
    .string()
    .min(1, { message: "Branch name is required" })
    .min(2, { message: "Branch name must be at least 2 characters" })
    .max(100, { message: "Branch name cannot exceed 100 characters" }),
  branch_location: z
    .string()
    .min(1, { message: "Branch location is required" })
    .min(3, { message: "Branch location must be at least 3 characters" })
    .max(200, { message: "Branch location cannot exceed 200 characters" }),
  drug_license_number: z
    .string()
    .min(1, { message: "Drug license number is required" })
    .min(5, { message: "Drug license number must be at least 5 characters" })
    .max(50, { message: "Drug license number cannot exceed 50 characters" }),
})

type BranchFormValues = z.infer<typeof branchSchema>

export default function AddBranchDialog({
  open,
  onOpenChange,
  pharmacyId,
  onSuccess,
}: AddBranchDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      branch_name: "",
      branch_location: "",
      drug_license_number: "",
    },
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const onSubmit = async (data: BranchFormValues) => {
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
      }

      const response = await backendApi.post(`/v1/org/new-branch`, submitData)

      if (response.data.success) {
        toast.success(response.data.message || "Branch added successfully!")
        onSuccess(response.data.data)
        onOpenChange(false)
        form.reset()
      } else {
        toast.error(response.data.message || "Failed to add branch. Please try again.")
      }
    } catch (error: unknown) {
      console.error("Error adding branch:", error)
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
          const fieldName = field as keyof BranchFormValues
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
          "Failed to add branch. Please check your connection and try again."
        toast.error(errorMessage)
        form.setError("root", {
          message: errorMessage,
        })
      }
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              {/* Root error message */}
              {form.formState.errors.root && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}

              <FormField
                control={form.control}
                name="branch_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Branch Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter branch name"
                        {...field}
                        className={form.formState.errors.branch_name ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Branch Location <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter branch location"
                        {...field}
                        className={form.formState.errors.branch_location ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="drug_license_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Drug License Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter drug license number"
                        {...field}
                        className={form.formState.errors.drug_license_number ? "border-red-500" : ""}
                      />
                    </FormControl>
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
                {isLoading ? "Adding Branch..." : "Add Branch"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

