"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Eye, Package2, BarChart3, Filter, List, Grid, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Product } from "@/types/sales"
import { backendApi } from "@/lib/axios-config"
import { useProductCategories } from "@/hooks/useProductCategories"

interface InventoryTableProps {
  onAddProduct: () => void
  onEditProduct: (product: Product) => void
  canAddProducts?: boolean
  refreshTrigger?: number
}

export function InventoryTable({
  onAddProduct,
  onEditProduct,
  canAddProducts = true,
  refreshTrigger,
}: InventoryTableProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeFilter, setActiveFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [categorySearchTerm, setCategorySearchTerm] = useState("")
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const limit = 10
  
  // Fetch categories from API
  const { categories } = useProductCategories()

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().replace(/_/g, " ").includes(categorySearchTerm.toLowerCase())
  )

  // Debounce search term
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setPage(1) // Reset to page 1 when search changes
    }, 500) // 500ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchTerm])

  // Reset page when category or filter changes
  useEffect(() => {
    setPage(1)
  }, [selectedCategory, activeFilter])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      
      if (debouncedSearchTerm.trim()) {
        params.append('search', debouncedSearchTerm.trim())
      }
      
      if (selectedCategory !== "all") {
        params.append('product_category_id', selectedCategory)
      }
      
      if (activeFilter === "lowStock") {
        params.append('lowStock', 'true')
      }
      
      if (activeFilter === "expiringSoon") {
        params.append('expiringSoon', 'true')
      }

      const response = await backendApi.get(`/v1/products/catalogue?${params.toString()}`)
      const data = response.data?.data || response.data
      
      // Map API response to Product type
      const mappedProducts: Product[] = (data.products || []).map((product: any) => ({
        id: product.id,
        name: product.product_name,
        generic_name: product.generic_name,
        description: product.description,
        category: product.product_category_name,
        manufacturer: product.manufacturer,
        barcode: product.barcode,
        qr_code: product.qrcode,
        unit_price: Number.parseFloat(product.unit_price || '0'),
        selling_price: Number.parseFloat(product.selling_price || '0'),
        unit_of_measure: product.unit,
        pack_size: product.pack_size,
        min_stock_level: product.min_stock,
        max_stock_level: product.max_stock,
        requires_prescription: product.requires_prescription,
        is_active: product.is_active,
        image_url: product.image,
        created_at: product.created_at,
        updated_at: product.updated_at,
      }))
      
      setProducts(mappedProducts)
      setTotal(data.total || 0)
      setTotalPages(data.total_pages || 1)
    } catch (error: unknown) {
      console.error("Failed to fetch products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearchTerm, selectedCategory, activeFilter])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Refresh table when refreshTrigger changes (but not on initial mount)
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      fetchProducts()
    }
  }, [refreshTrigger, fetchProducts])

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      setIsDeleting(true)
      await backendApi.delete(`/products/${productToDelete.id}`)
      toast.success("Product deleted successfully")
      fetchProducts()
      setDeleteModalOpen(false)
      setProductToDelete(null)
    } catch (error: unknown) {
      console.error("Failed to delete product:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setProductToDelete(null)
  }

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-800"
    
    const categoryLower = category.toLowerCase()
    
    // Map actual category names to colors
    if (categoryLower.includes("pharmaceutical")) {
      return "bg-indigo-100 text-indigo-800"
    }
    if (categoryLower.includes("prescription") || categoryLower.includes("prescription medication")) {
      return "bg-red-100 text-red-800"
    }
    if (categoryLower.includes("otc") || categoryLower.includes("over the counter")) {
      return "bg-blue-100 text-blue-800"
    }
    if (categoryLower.includes("supplement")) {
      return "bg-green-100 text-green-800"
    }
    if (categoryLower.includes("medical device")) {
      return "bg-purple-100 text-purple-800"
    }
    if (categoryLower.includes("cosmetic")) {
      return "bg-pink-100 text-pink-800"
    }
    if (categoryLower.includes("opioid")) {
      return "bg-orange-100 text-orange-800"
    }
    
    return "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-3 md:p-4 rounded-lg border border-[#e5e7eb]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-10 bg-white border-[#e5e7eb]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => {
                setSelectedCategory(value)
                setCategorySearchTerm("") // Reset search when category is selected
              }} 
              defaultValue="all"
            >
              <SelectTrigger className="w-full sm:w-[140px] md:w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {/* Search Input */}
                <div className="px-2 pt-2 pb-1 sticky top-0 bg-white z-10 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearchTerm}
                      onChange={(e) => {
                        e.stopPropagation()
                        setCategorySearchTerm(e.target.value)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="all" className="cursor-pointer">
                    All Categories
                  </SelectItem>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()} className="cursor-pointer">
                        {category.category_name.replace(/_/g, " ")}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-sm text-gray-500 text-center">
                      {categorySearchTerm ? `No categories found matching "${categorySearchTerm}"` : "No categories available"}
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>

            <Select value={activeFilter} onValueChange={setActiveFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[140px] md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="lowStock">Low Stock</SelectItem>
                <SelectItem value="outOfStock">Out of Stock</SelectItem>
                <SelectItem value="expiringSoon">Expiring Soon</SelectItem>
              </SelectContent>
            </Select>

            {/* <Button variant="outline" className="gap-2 bg-transparent hidden sm:flex">
              <Filter className="w-4 h-4" />
              <span className="hidden md:inline">More Filters</span>
            </Button>

            <div className="hidden sm:flex items-center gap-1 border border-[#e5e7eb] rounded">
              <Button variant="ghost" size="sm" className="p-2">
                <List className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Grid className="w-4 h-4" />
              </Button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e5e7eb]">
                <TableHead className="w-12 pl-3 md:pl-5">
                  <Checkbox />
                </TableHead>
                <TableHead className="text-[#6b7280] font-medium min-w-[200px]">Product</TableHead>
                <TableHead className="text-[#6b7280] font-medium">Category</TableHead>
                <TableHead className="text-[#6b7280] font-medium">Price</TableHead>
                <TableHead className="text-[#6b7280] font-medium hidden lg:table-cell">Selling Price</TableHead>
                <TableHead className="text-[#6b7280] font-medium hidden xl:table-cell">Manufacturer</TableHead>
                <TableHead className="text-[#6b7280] font-medium hidden xl:table-cell">Barcode</TableHead>
                <TableHead className="text-[#6b7280] font-medium hidden md:table-cell">Updated</TableHead>
                <TableHead className="text-[#6b7280] font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="text-gray-500">
                      <Package2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm md:text-base">No products found. Add your first product to get started.</p>
                      {canAddProducts && (
                        <Button onClick={onAddProduct} className="mt-3 bg-[#0f766e] hover:bg-[#0d6660] text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Product
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  return (
                    <TableRow key={product.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <TableCell className="pl-3 md:pl-5">
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#dbeafe] rounded-lg flex items-center justify-center text-base md:text-lg flex-shrink-0">
                            {product.image_url ? (
                              <img
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.name || ""}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              "💊"
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-[#111827] text-sm md:text-base truncate">
                              {product.name}
                            </div>
                            <div className="text-xs md:text-sm text-[#6b7280] truncate">
                              {product.generic_name || `ID: ${product.id}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCategoryColor(product.category)} border-0 font-medium text-xs`}>
                          {product.category || "Other"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium text-[#111827] text-sm md:text-base">
                          ₹{Number(product?.unit_price || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-[#6b7280]">{product.unit_of_measure}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="font-medium text-[#111827]">
                          ₹{Number(product?.selling_price || 0).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm font-medium text-[#111827]">{product.manufacturer || "N/A"}</div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm">
                          <div className="font-medium text-[#111827]">{product.barcode || "N/A"}</div>
                          {product.qr_code && (
                            <div className="text-xs text-[#6b7280]">QR: {product.qr_code.slice(0, 8)}...</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-xs text-[#6b7280]">
                          {product.updated_at ? new Date(product.updated_at).toLocaleDateString() : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5 md:gap-1">
                          {canAddProducts && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-7 w-7 md:h-8 md:w-8"
                              onClick={() => onEditProduct?.(product)}
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#6b7280]" />
                            </Button>
                          )}
                        

                          {canAddProducts && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-7 w-7 md:h-8 md:w-8 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleDeleteClick(product)}
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#6b7280] hover:text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-3 py-3 md:px-6 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                Previous
              </Button>
              <span className="text-sm text-gray-700 flex items-center">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                Next
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-md"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-md"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Delete Product</h3>
                <p className="text-xs md:text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm md:text-base text-gray-700">
                Are you sure you want to delete <span className="font-semibold">"{productToDelete.name}"</span>?
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-2">
                This will permanently remove the product from your inventory.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 md:gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="w-full sm:w-auto px-4 py-2 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete Product"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
