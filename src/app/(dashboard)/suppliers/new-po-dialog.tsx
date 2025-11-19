"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronsUpDownIcon, CheckIcon, SearchIcon, PlusIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { backendApi } from "@/lib/axios-config"
import { useProductCategories } from "@/hooks/useProductCategories"
import { useAppSelector } from "@/store/hooks"
import { useBranchSync } from "@/hooks/useBranchSync"
import { useUser } from "@/contexts/UserContext"

interface Supplier {
  supplier_id: number
  supplier_name: string
}


interface Product {
  id: number
  product_id?: number
  product_name: string
}

interface ProductItem {
  product_id: string
  quantity: string
}

interface NewPODialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Validation schema with user-friendly error messages
const purchaseOrderSchema = z.object({
  supplier_id: z.string().min(1, { message: "Supplier is required" }),
  product_category_id: z.string().min(1, { message: "Product category is required" }),
  pharmacy_branch_id: z.string().min(1, { message: "Branch is required" }),
  purchase_date: z.string().min(1, { message: "Purchase date is required" }),
  purchase_amount: z
    .string()
    .min(1, { message: "Purchase amount is required" })
    .refine((val) => {
      const num = Number.parseFloat(val)
      return !isNaN(num) && num > 0
    }, { message: "Purchase amount must be a positive number" }),
  expected_delivery_date: z.string().min(1, { message: "Expected delivery date is required" }),
}).refine((data) => {
  const purchaseDate = new Date(data.purchase_date)
  const deliveryDate = new Date(data.expected_delivery_date)
  return deliveryDate >= purchaseDate
}, {
  message: "Expected delivery date must be on or after purchase date",
  path: ["expected_delivery_date"],
})

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>

export function NewPODialog({ open, onOpenChange }: NewPODialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const { categories } = useProductCategories()
  const { user } = useUser()
  const branches = useAppSelector((state) => state.branch.branches)
  const loadingBranches = useAppSelector((state) => state.branch.isLoading)
  
  // Sync branches to Redux
  useBranchSync(user?.pharmacy_id)
  const [supplierOpen, setSupplierOpen] = useState(false)
  const [supplierSearch, setSupplierSearch] = useState("")
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState("")
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [productItems, setProductItems] = useState<ProductItem[]>([{ product_id: "", quantity: "" }])

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplier_id: "",
      product_category_id: "",
      pharmacy_branch_id: "",
      purchase_date: "",
      purchase_amount: "",
      expected_delivery_date: "",
    },
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset()
      setProductItems([{ product_id: "", quantity: "" }])
      setSupplierSearch("")
      setDebouncedSupplierSearch("")
      setSupplierOpen(false)
    }
  }, [open, form])

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSupplierSearch(supplierSearch)
    }, 500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [supplierSearch])

  const fetchSuppliersAndCategories = useCallback(async () => {
    setIsLoadingData(true)
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "100",
      })

      if (debouncedSupplierSearch.trim()) {
        params.append("search", debouncedSupplierSearch.trim())
      }

      const suppliersResponse = await backendApi.get(`/v1/supplier/list?${params.toString()}`)
      const suppliersData = suppliersResponse.data?.data || suppliersResponse.data
      setSuppliers(suppliersData?.suppliers || [])

      const productsResponse = await backendApi.get(`/v1/products/catalogue?page=1&limit=100`)
      const productsData = productsResponse.data?.data || productsResponse.data
      // Map API response to Product type
      const mappedProducts: Product[] = (productsData?.products || []).map((product: any) => ({
        id: product.id || product.product_id,
        product_id: product.product_id || product.id,
        product_name: product.product_name || product.name,
      }))
      setProducts(mappedProducts)
    } catch (error: unknown) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoadingData(false)
    }
  }, [debouncedSupplierSearch])

  useEffect(() => {
    if (open) {
      fetchSuppliersAndCategories()
    } else {
      setSupplierSearch("")
      setDebouncedSupplierSearch("")
    }
  }, [open, debouncedSupplierSearch, fetchSuppliersAndCategories])

  const handleAddProduct = () => {
    setProductItems([...productItems, { product_id: "", quantity: "" }])
  }

  const handleRemoveProduct = (index: number) => {
    if (productItems.length > 1) {
      setProductItems(productItems.filter((_, i) => i !== index))
    }
  }

  const handleProductChange = (index: number, field: keyof ProductItem, value: string) => {
    // Check for duplicate product selection
    if (field === "product_id" && value) {
      const isDuplicate = productItems.some(
        (item, i) => i !== index && item.product_id === value && item.product_id !== ""
      )
      if (isDuplicate) {
        toast.error("This product is already added. Please select a different product.")
        return
      }
    }

    const newProducts = [...productItems]
    newProducts[index][field] = value
    setProductItems(newProducts)
  }

  // Get available products (excluding already selected ones)
  const getAvailableProducts = (currentIndex: number) => {
    const selectedProductIds = productItems
      .map((item, index) => (index !== currentIndex && item.product_id ? item.product_id : null))
      .filter((id): id is string => id !== null && id !== "")

    return products.filter((product) => {
      const productId = (product.id || product.product_id)?.toString()
      return productId && !selectedProductIds.includes(productId)
    })
  }

  const onSubmit = async (data: PurchaseOrderFormValues) => {
    // Validate products separately
    const validProducts = productItems.filter((p) => p.product_id && p.quantity)
    if (validProducts.length === 0) {
      toast.error("Please add at least one product")
      return
    }

    // Check for duplicate products
    const productIds = validProducts.map((p) => p.product_id)
    const uniqueProductIds = new Set(productIds)
    if (productIds.length !== uniqueProductIds.size) {
      toast.error("Duplicate products are not allowed. Please remove duplicate entries.")
      return
    }

    // Validate product quantities
    for (const product of validProducts) {
      const quantity = Number.parseInt(product.quantity, 10)
      if (isNaN(quantity) || quantity <= 0) {
        toast.error("All product quantities must be positive numbers")
        return
      }
    }

    setIsLoading(true)

    try {
      const payload = {
        supplier_id: Number.parseInt(data.supplier_id),
        product_category_id: Number.parseInt(data.product_category_id),
        pharmacy_branch_id: Number.parseInt(data.pharmacy_branch_id),
        purchase_date: new Date(data.purchase_date).toISOString(),
        purchase_amount: Number.parseFloat(data.purchase_amount),
        expected_delivery_date: new Date(data.expected_delivery_date).toISOString(),
        products: validProducts.map((p) => ({
          product_id: Number.parseInt(p.product_id),
          quantity: Number.parseInt(p.quantity),
        })),
      }

      const response = await backendApi.post("/v1/orders/make-order", payload)
      const responseData = response.data?.data || response.data

      toast.success(responseData?.message || "Purchase order created successfully!")
      form.reset()
      setProductItems([{ product_id: "", quantity: "" }])
      setSupplierSearch("")
      setDebouncedSupplierSearch("")
      setSupplierOpen(false)
      onOpenChange(false)
    } catch (error: unknown) {
      console.error("Failed to create purchase order:", error)
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
          const fieldName = field as keyof PurchaseOrderFormValues
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
          "Failed to create purchase order. Please check your connection and try again."
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Purchase Order</DialogTitle>
          <DialogDescription>Enter the purchase order details below to create a new PO.</DialogDescription>
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
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Supplier <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={supplierOpen}
                            className={cn(
                              "w-full justify-between bg-transparent font-normal",
                              !field.value && "text-muted-foreground",
                              form.formState.errors.supplier_id && "border-red-500"
                            )}
                            type="button"
                          >
                            {field.value
                              ? suppliers.find((s) => s.supplier_id.toString() === field.value)?.supplier_name
                              : "Select supplier..."}
                            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                          <div className="flex flex-col">
                            <div className="border-b p-2">
                              <div className="relative">
                                <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  placeholder="Search supplier..."
                                  value={supplierSearch}
                                  onChange={(e) => setSupplierSearch(e.target.value)}
                                  className="h-9 pl-8"
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                      setSupplierOpen(false)
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto p-1">
                              {isLoadingData ? (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading suppliers...</div>
                              ) : suppliers.length === 0 ? (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  {debouncedSupplierSearch ? "No suppliers found" : "No suppliers available"}
                                </div>
                              ) : (
                                suppliers.map((supplier) => (
                                  <div
                                    key={supplier.supplier_id}
                                    className={cn(
                                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                      field.value === supplier.supplier_id.toString() && "bg-accent",
                                    )}
                                    onClick={() => {
                                      field.onChange(supplier.supplier_id.toString())
                                      setSupplierOpen(false)
                                      setSupplierSearch("")
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 size-4",
                                        field.value === supplier.supplier_id.toString() ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {supplier.supplier_name}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="product_category_id"
              
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Product Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger className={form.formState.errors.product_category_id ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingData ? (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : categories.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            No categories available
                          </SelectItem>
                        ) : (
                          categories.map((category) => (
                            <SelectItem className="w-full" key={category.id} value={category.id.toString()}>
                              {category.category_name.replace(/_/g, " ")}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pharmacy_branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      Branch <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loadingBranches || !branches.length}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className={form.formState.errors.pharmacy_branch_id ? "border-red-500" : ""}>
                          <SelectValue placeholder={loadingBranches ? "Loading branches..." : "Select branch"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingBranches ? (
                          <SelectItem value="loading" disabled>
                            Loading branches...
                          </SelectItem>
                        ) : branches.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            No branches available
                          </SelectItem>
                        ) : (
                          branches.map((branch) => (
                            <SelectItem className="w-full" key={branch.id} value={branch.id.toString()}>
                              {branch.branch_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Purchase Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        className={form.formState.errors.purchase_date ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchase_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Purchase Amount <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="120"
                        {...field}
                        className={form.formState.errors.purchase_amount ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expected_delivery_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Expected Delivery Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        className={form.formState.errors.expected_delivery_date ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="grid gap-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">
                  Products <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddProduct}
                  className="gap-2 bg-transparent"
                >
                  <PlusIcon className="size-4" />
                  Add Product
                </Button>
              </div>

              <div className="space-y-3">
                {productItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 grid gap-2">
                      <Select
                        value={item.product_id}
                        onValueChange={(value) => handleProductChange(index, "product_id", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product..." />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingData ? (
                            <SelectItem value="loading" disabled>
                              Loading products...
                            </SelectItem>
                          ) : getAvailableProducts(index).length === 0 ? (
                            <SelectItem value="empty" disabled>
                              {products.length === 0 ? "No products available" : "All products already added"}
                            </SelectItem>
                          ) : (
                            getAvailableProducts(index).map((product) => {
                              const productId = (product.id || product.product_id)?.toString()
                              return (
                                <SelectItem key={productId} value={productId || ""}>
                                  {product.product_name}
                                </SelectItem>
                              )
                            })
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    {productItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveProduct(index)}
                        className="shrink-0"
                      >
                        <XIcon className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                form.reset()
                setProductItems([{ product_id: "", quantity: "" }])
                setSupplierSearch("")
                setDebouncedSupplierSearch("")
                setSupplierOpen(false)
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating PO..." : "Create PO"}
            </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
