"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { backendApi } from "@/lib/axios-config"

interface AddSupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Validation schema with user-friendly error messages
const supplierSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Supplier name is required" })
    .min(2, { message: "Supplier name must be at least 2 characters" })
    .max(100, { message: "Supplier name cannot exceed 100 characters" }),
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" })
    .max(100, { message: "Email address cannot exceed 100 characters" }),
  gstin: z
    .string()
    .min(1, { message: "GSTIN is required" })
    .min(15, { message: "GSTIN must be exactly 15 characters" })
    .max(15, { message: "GSTIN must be exactly 15 characters" }),
  phone_number: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits" }),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .min(5, { message: "Address must be at least 5 characters" })
    .max(500, { message: "Address cannot exceed 500 characters" }),
  license_number: z
    .string()
    .min(1, { message: "License number is required" })
    .min(3, { message: "License number must be at least 3 characters" })
    .max(50, { message: "License number cannot exceed 50 characters" }),
})

type SupplierFormValues = z.infer<typeof supplierSchema>

export function AddSupplierDialog({ open, onOpenChange }: AddSupplierDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      email: "",
      gstin: "",
      phone_number: "",
      address: "",
      license_number: "",
    },
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const onSubmit = async (data: SupplierFormValues) => {
    setIsLoading(true)

    try {
      const response = await backendApi.post("/v1/supplier/new-supplier", data)
      const responseData = response.data?.data || response.data

      toast.success(responseData?.message || "Supplier added successfully!")
      form.reset()
      onOpenChange(false)
    } catch (error: unknown) {
      console.error("Failed to add supplier:", error)
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
          const fieldName = field as keyof SupplierFormValues
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
          "Failed to add supplier. Please check your connection and try again."
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
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>Enter the supplier details below to add them to your system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              {/* Root error message */}
              {form.formState.errors.root && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Supplier Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter supplier name"
                        {...field}
                        className={form.formState.errors.name ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="supplier@example.com"
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
                name="gstin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      GSTIN <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="29ABCDE1234F1Z5"
                        {...field}
                        maxLength={15}
                        className={form.formState.errors.gstin ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="9898912998"
                        {...field}
                        maxLength={10}
                        className={form.formState.errors.phone_number ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">Enter 10 digits without spaces or special characters</p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter address"
                        {...field}
                        className={form.formState.errors.address ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="license_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      License Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="PL-1234567890"
                        {...field}
                        className={form.formState.errors.license_number ? "border-red-500" : ""}
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding Supplier..." : "Add Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
