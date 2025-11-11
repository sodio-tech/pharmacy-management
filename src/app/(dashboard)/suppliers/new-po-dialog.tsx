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
import { ChevronsUpDownIcon, CheckIcon, SearchIcon, PlusIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { backendApi } from "@/lib/axios-config"
import { useProductCategories } from "@/hooks/useProductCategories"
import { useBranches } from "@/hooks/useBranches"
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

export function NewPODialog({ open, onOpenChange }: NewPODialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const { categories } = useProductCategories()
  const { user } = useUser()
  const { branches, isLoading: loadingBranches } = useBranches(user?.pharmacy_id)
  const [supplierOpen, setSupplierOpen] = useState(false)
  const [supplierSearch, setSupplierSearch] = useState("")
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState("")
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [formData, setFormData] = useState({
    supplier_id: "",
    product_category_id: "",
    pharmacy_branch_id: "",
    purchase_date: "",
    purchase_amount: "",
    expected_delivery_date: "",
  })

  const [productItems, setProductItems] = useState<ProductItem[]>([{ product_id: "", quantity: "" }])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.supplier_id) {
      toast.error("Please select a supplier")
      return
    }

    if (!formData.pharmacy_branch_id) {
      toast.error("Please select a branch")
      return
    }

    const validProducts = productItems.filter((p) => p.product_id && p.quantity)
    if (validProducts.length === 0) {
      toast.error("Please add at least one product")
      return
    }

    // Check for duplicate products in valid products
    const productIds = validProducts.map((p) => p.product_id)
    const uniqueProductIds = new Set(productIds)
    if (productIds.length !== uniqueProductIds.size) {
      toast.error("Duplicate products are not allowed. Please remove duplicate entries.")
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        supplier_id: Number.parseInt(formData.supplier_id),
        product_category_id: Number.parseInt(formData.product_category_id),
        pharmacy_branch_id: Number.parseInt(formData.pharmacy_branch_id),
        purchase_date: new Date(formData.purchase_date).toISOString(),
        purchase_amount: Number.parseFloat(formData.purchase_amount),
        expected_delivery_date: new Date(formData.expected_delivery_date).toISOString(),
        products: validProducts.map((p) => ({
          product_id: Number.parseInt(p.product_id),
          quantity: Number.parseInt(p.quantity),
        })),
      }

      const response = await backendApi.post("/v1/orders/make-order", payload)
      const data = response.data?.data || response.data

      toast.success(data?.message || "Purchase order created successfully")

      setFormData({
        supplier_id: "",
        product_category_id: "",
        pharmacy_branch_id: "",
        purchase_date: "",
        purchase_amount: "",
        expected_delivery_date: "",
      })
      setProductItems([{ product_id: "", quantity: "" }])
      setSupplierSearch("")
      setDebouncedSupplierSearch("")
      setSupplierOpen(false)
      onOpenChange(false)
    } catch (error: unknown) {
      console.error("Failed to create purchase order:", error)
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
                              formData.supplier_id === supplier.supplier_id.toString() && "bg-accent",
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
              <Label htmlFor="pharmacy_branch_id">Branch</Label>
              <Select
                value={formData.pharmacy_branch_id}
                onValueChange={(value) => setFormData({ ...formData, pharmacy_branch_id: value })}
                disabled={loadingBranches || !branches.length}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingBranches ? "Loading branches..." : "Select branch"} />
                </SelectTrigger>
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
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.branch_name}
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

            <div className="grid gap-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Products</Label>
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
