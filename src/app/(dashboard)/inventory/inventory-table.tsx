"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Eye, Package2, BarChart3, Filter, List, Grid, Trash2 } from "lucide-react"
import { inventoryService, type Product } from "@/services/inventoryService"
import { toast } from "react-toastify"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InventoryTableProps {
  onAddProduct: () => void
  onEditProduct: (product: Product) => void
  onViewBatch: (product: Product) => void
  onAddBatch: (productId: string) => void
  canAddProducts?: boolean
}

export function InventoryTable({
  onAddProduct,
  onEditProduct,
  onViewBatch,
  onAddBatch,
  canAddProducts = true,
}: InventoryTableProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeFilter, setActiveFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, selectedCategory, activeFilter, page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const filters = {
        search: searchTerm,
        category: selectedCategory === "all" ? "" : selectedCategory,
        page,
        limit: 20,
        lowStock: activeFilter === "lowStock",
        expiringSoon: activeFilter === "expiringSoon",
      }

      const response = await inventoryService.getProducts(filters)
      setProducts(response.data)
      setTotalPages(response.pagination.total_pages)
    } catch (error: any) {
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      setIsDeleting(true)
      await inventoryService.deleteProduct(productToDelete.id)
      toast.success("Product deleted successfully")
      fetchProducts()
      setDeleteModalOpen(false)
      setProductToDelete(null)
    } catch (error: any) {
      toast.error("Failed to delete product")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setProductToDelete(null)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      OTC: "bg-blue-100 text-blue-800",
      PRESCRIPTION: "bg-red-100 text-red-800",
      SUPPLEMENTS: "bg-green-100 text-green-800",
      MEDICAL_DEVICES: "bg-purple-100 text-purple-800",
      COSMETICS: "bg-pink-100 text-pink-800",
      OTHER: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.OTHER
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[140px] md:w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="OTC">OTC</SelectItem>
                <SelectItem value="PRESCRIPTION">Prescription</SelectItem>
                <SelectItem value="SUPPLEMENTS">Supplements</SelectItem>
                <SelectItem value="MEDICAL_DEVICES">Medical Devices</SelectItem>
                <SelectItem value="COSMETICS">Cosmetics</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
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

            <Button variant="outline" className="gap-2 bg-transparent hidden sm:flex">
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
            </div>
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
                                alt={product.name}
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
                              {product.generic_name || `SKU: ${product.id.slice(0, 8)}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCategoryColor(product.category)} border-0 font-medium text-xs`}>
                          {product.category === "PRESCRIPTION"
                            ? "Rx"
                            : product.category === "OTC"
                              ? "OTC"
                              : product.category === "SUPPLEMENTS"
                                ? "Supp"
                                : product.category === "MEDICAL_DEVICES"
                                  ? "Device"
                                  : product.category === "COSMETICS"
                                    ? "Care"
                                    : "Other"}
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
                          {new Date(product.updated_at).toLocaleDateString()}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-7 w-7 md:h-8 md:w-8"
                            onClick={() => onViewBatch?.(product)}
                            title="View Batch"
                          >
                            <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#6b7280]" />
                          </Button>
                          {canAddProducts && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-7 w-7 md:h-8 md:w-8 hidden sm:flex"
                              onClick={() => onAddBatch(product.id)}
                              title="Add Batch"
                            >
                              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#6b7280]" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-7 w-7 md:h-8 md:w-8 hidden md:flex"
                            title="Analytics"
                          >
                            <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#6b7280]" />
                          </Button>

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
