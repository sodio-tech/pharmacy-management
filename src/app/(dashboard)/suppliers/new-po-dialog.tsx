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
import { toast } from "react-toastify"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronsUpDownIcon, CheckIcon, SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { backendApi } from "@/lib/axios-config"
import { useProductCategories } from "@/hooks/useProductCategories"

interface Supplier {
  supplier_id: number
  supplier_name: string
}

interface ProductCategory {
  id: number
  category_name: string
}

interface NewPODialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewPODialog({ open, onOpenChange }: NewPODialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const { categories } = useProductCategories()
  const [supplierOpen, setSupplierOpen] = useState(false)
  const [supplierSearch, setSupplierSearch] = useState("")
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState("")
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [formData, setFormData] = useState({
    supplier_id: "",
    product_category_id: "",
    purchase_date: "",
    purchase_amount: "",
    expected_delivery_date: "",
  })

  // Debounce search term
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
    } catch (error: unknown) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to load suppliers and categories")
    } finally {
      setIsLoadingData(false)
    }
  }, [debouncedSupplierSearch])

  useEffect(() => {
    if (open) {
      fetchSuppliersAndCategories()
    } else {
      // Reset search when dialog closes
      setSupplierSearch("")
      setDebouncedSupplierSearch("")
    }
  }, [open, debouncedSupplierSearch, fetchSuppliersAndCategories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.supplier_id) {
      toast.error("Please select a supplier")
      return
    }
    
    setIsLoading(true)

    try {
      const payload = {
        supplier_id: Number.parseInt(formData.supplier_id),
        product_category_id: Number.parseInt(formData.product_category_id),
        purchase_date: new Date(formData.purchase_date).toISOString(),
        purchase_amount: Number.parseFloat(formData.purchase_amount),
        expected_delivery_date: new Date(formData.expected_delivery_date).toISOString(),
      }

      const response = await backendApi.post("/v1/orders/make-order", payload)
      const data = response.data?.data || response.data

      toast.success(data?.message || "Purchase order created successfully")

      setFormData({
        supplier_id: "",
        product_category_id: "",
        purchase_date: "",
        purchase_amount: "",
        expected_delivery_date: "",
      })
      setSupplierSearch("")
      setDebouncedSupplierSearch("")
      setSupplierOpen(false)
      onOpenChange(false)
    } catch (error: unknown) {
      console.error("Failed to create purchase order:", error)
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      toast.error(err?.response?.data?.message || err?.message || "Failed to create purchase order")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Purchase Order</DialogTitle>
          <DialogDescription>Enter the purchase order details below to create a new PO.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="supplier_id">Supplier</Label>
              <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={supplierOpen}
                    className="w-full justify-between bg-transparent font-normal"
                    type="button"
                  >
                    {formData.supplier_id
                      ? suppliers.find((s) => s.supplier_id.toString() === formData.supplier_id)?.supplier_name
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
                                formData.supplier_id === supplier.supplier_id.toString() && "bg-accent"
                              )}
                              onClick={() => {
                                setFormData({ ...formData, supplier_id: supplier.supplier_id.toString() })
                                setSupplierOpen(false)
                                setSupplierSearch("")
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 size-4",
                                  formData.supplier_id === supplier.supplier_id.toString() ? "opacity-100" : "opacity-0",
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product_category_id">Product Category</Label>
              <Select
                value={formData.product_category_id}
                onValueChange={(value) => setFormData({ ...formData, product_category_id: value })}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
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
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.category_name.replace(/_/g, " ")}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                type="datetime-local"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchase_amount">Purchase Amount</Label>
              <Input
                id="purchase_amount"
                type="number"
                step="0.01"
                placeholder="120"
                value={formData.purchase_amount}
                onChange={(e) => setFormData({ ...formData, purchase_amount: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expected_delivery_date">Expected Delivery Date</Label>
              <Input
                id="expected_delivery_date"
                type="datetime-local"
                value={formData.expected_delivery_date}
                onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create PO"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
