"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Edit,
  Eye,
  Package2,
  BarChart3,
  Filter,
  List,
  Grid
} from "lucide-react"
import { inventoryService, Product } from "@/services/inventoryService"
import { toast } from "react-toastify"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InventoryTableProps {
  onAddProduct: () => void
  onEditProduct: (product: Product) => void
  onViewBatch: (product: Product) => void
  canAddProducts?: boolean
}

export function InventoryTable({
  onAddProduct,
  onEditProduct,
  onViewBatch,
  canAddProducts = true
}: InventoryTableProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeFilter, setActiveFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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
        expiringSoon: activeFilter === "expiringSoon"
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

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return
    }

    try {
      await inventoryService.deleteProduct(productId)
      toast.success("Product deleted successfully")
      fetchProducts()
    } catch (error: any) {
      toast.error("Failed to delete product")
    }
  }

  // Helper functions for the table
  const getStockLevel = (currentStock: number, reorderLevel: number) => {
    if (currentStock === 0) return { level: "out", color: "text-red-600", bg: "bg-red-100" }
    if (currentStock <= reorderLevel) return { level: "low", color: "text-orange-600", bg: "bg-orange-100" }
    if (currentStock <= reorderLevel * 1.5) return { level: "medium", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { level: "good", color: "text-green-600", bg: "bg-green-100" }
  }

  const getStockBar = (currentStock: number, reorderLevel: number) => {
    const stockLevel = getStockLevel(currentStock, reorderLevel)
    const percentage = Math.min((currentStock / (reorderLevel * 2)) * 100, 100)

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${stockLevel.bg.replace('bg-', 'bg-').replace('-100', '-500')}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }

  const getExpiryInfo = (batches: any[]) => {
    if (!batches || batches.length === 0) {
      return { text: "No batches", color: "text-gray-500", days: null }
    }

    const today = new Date()
    const nearestExpiry = batches
      .map(batch => new Date(batch.expiryDate))
      .sort((a, b) => a.getTime() - b.getTime())[0]

    const daysUntilExpiry = Math.ceil((nearestExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      return { text: "Expired", color: "text-red-600", days: daysUntilExpiry }
    } else if (daysUntilExpiry <= 7) {
      return { text: "Expires soon", color: "text-red-600", days: daysUntilExpiry }
    } else if (daysUntilExpiry <= 30) {
      return { text: "Expiring soon", color: "text-orange-600", days: daysUntilExpiry }
    } else {
      return { text: "Good", color: "text-green-600", days: daysUntilExpiry }
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      OTC: "bg-blue-100 text-blue-800",
      PRESCRIPTION: "bg-red-100 text-red-800",
      SUPPLEMENTS: "bg-green-100 text-green-800",
      MEDICAL_DEVICES: "bg-purple-100 text-purple-800",
      COSMETICS: "bg-pink-100 text-pink-800",
      OTHER: "bg-gray-100 text-gray-800"
    }
    return colors[category] || colors.OTHER
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}

      <div className="mb-6 bg-white p-4 rounded-lg border border-[#e5e7eb]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, batch, or barcode..." className="pl-10 bg-white border-[#e5e7eb]" />
          </div>

          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="OTC">OTC (Over The Counter)</SelectItem>
              <SelectItem value="PRESCRIPTION">Prescription Medicines</SelectItem>
              <SelectItem value="SUPPLEMENTS">Supplements & Vitamins</SelectItem>
              <SelectItem value="MEDICAL_DEVICES">Medical Devices</SelectItem>
              <SelectItem value="COSMETICS">Cosmetics</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={activeFilter}
            onValueChange={setActiveFilter}
            defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock Status</SelectItem>
              <SelectItem value="lowStock">Low Stock</SelectItem>
              <SelectItem value="outOfStock">Out of Stock</SelectItem>
              <SelectItem value="expiringSoon">Expiring Soon</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>

          <div className="flex items-center gap-1 border border-[#e5e7eb] rounded">
            <Button variant="ghost" size="sm" className="p-2">
              <List className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>


      {/* Products Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#e5e7eb]">
              <TableHead className="w-12 pl-5">
                <Checkbox />
              </TableHead>
              <TableHead className="text-[#6b7280] font-medium">Product</TableHead>
              <TableHead className="text-[#6b7280] font-medium">Category</TableHead>
              <TableHead className="text-[#6b7280] font-medium">Stock</TableHead>
              <TableHead className="text-[#6b7280] font-medium">Unit Price</TableHead>
              <TableHead className="text-[#6b7280] font-medium">Selling Price</TableHead>
              <TableHead className="text-[#6b7280] font-medium">Manufacturer</TableHead>
              <TableHead className="text-[#6b7280] font-medium">Barcode</TableHead>
              <TableHead className="text-[#6b7280] font-medium">Last Updated</TableHead>
              <TableHead className="text-[#6b7280] font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="text-gray-500">
                    <Package2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No products found. Add your first product to get started.</p>
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
                    <TableCell className="pl-5">
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#dbeafe] rounded-lg flex items-center justify-center text-lg">
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
                        <div>
                          <div className="font-medium text-[#111827]">{product.name}</div>
                          <div className="text-sm text-[#6b7280]">
                            {product.generic_name || `SKU: ${product.id.slice(0, 8)}`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCategoryColor(product.category)} border-0 font-medium`}>
                        {product.category === "PRESCRIPTION"
                          ? "Prescription"
                          : product.category === "OTC"
                            ? "OTC"
                            : product.category === "SUPPLEMENTS"
                              ? "Supplement"
                              : product.category === "MEDICAL_DEVICES"
                                ? "Medical Device"
                                : product.category === "COSMETICS"
                                  ? "Personal Care"
                                  : product.category === "OTHER"
                                    ? "Other"
                                    : product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">{getStockBar(50, product.min_stock_level)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#111827]">₹{Number(product?.unit_price || 0).toFixed(2)}</div>
                      <div className="text-xs text-[#6b7280]">{product.unit_of_measure}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#111827]">₹{Number(product?.selling_price || 0).toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-[#111827]">{product.manufacturer || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium text-[#111827]">{product.barcode || "N/A"}</div>
                        {product.qr_code && (
                          <div className="text-xs text-[#6b7280]">QR: {product.qr_code.slice(0, 8)}...</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-[#6b7280]">{new Date(product.updated_at).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 flex-wrap">
                        {canAddProducts && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-8 w-8"
                            onClick={() => onEditProduct?.(product)}
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4 text-[#6b7280]" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8"
                          onClick={() => onViewBatch?.(product)}
                          title="View Batch Details"
                        >
                          <Eye className="w-4 h-4 text-[#6b7280]" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8" title="Stock Analytics">
                          <BarChart3 className="w-4 h-4 text-[#6b7280]" />
                        </Button>
                        {canAddProducts && (
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8" title="Reorder Stock">
                            <Package2 className="w-4 h-4 text-[#6b7280]" />
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}