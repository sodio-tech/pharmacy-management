import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { CreditCard as Edit, Plus, Minus, Trash2, Eye, ChartBar as BarChart3, Package2, TriangleAlert as AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

interface Product {
  id: string
  sku: string
  name: string
  category: "OTC" | "PRESCRIPTION" | "SUPPLEMENT"
  price: number
  reorderLevel: number
  totalStock: number
  isLowStock: boolean
  expiringSoonCount: number
  batches: Array<{
    id: string
    batchNumber: string
    quantity: number
    expiryDate: string
    supplier?: {
      name: string
    }
  }>
}

function getStockBar(stock: { current: number; total: number; level: string }) {
  const percentage = (stock.current / stock.total) * 100
  let barColor = "bg-[#16a34a]" // green for good stock

  if (stock.level === "low")
    barColor = "bg-[#dc2626]" // red for low stock
  else if (stock.level === "medium")
    barColor = "bg-[#ea580c]" // orange for medium stock
  else if (stock.level === "out") barColor = "bg-[#6b7280]" // gray for out of stock

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="font-medium">
          {stock.current} / {stock.total} min
        </span>
      </div>
      <div className="w-full bg-[#f3f4f6] rounded-full h-2">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
    </div>
  )
}

export function InventoryTable({ onAddProduct, onEditProduct, onViewBatch }: {
  onAddProduct?: () => void
  onEditProduct?: (product: any) => void  
  onViewBatch?: (product: any) => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        console.log("Failed to fetch products, using empty array")
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "PRESCRIPTION":
        return "bg-[#dbeafe] text-[#2563eb]"
      case "OTC":
        return "bg-[#fef9c3] text-[#ca8a04]"
      case "SUPPLEMENT":
        return "bg-[#dcfce7] text-[#16a34a]"
      default:
        return "bg-[#f3f4f6] text-[#6b7280]"
    }
  }

  const getStockLevel = (totalStock: number, reorderLevel: number) => {
    if (totalStock === 0) return "out"
    if (totalStock <= reorderLevel) return "low"
    if (totalStock <= reorderLevel * 2) return "medium"
    return "high"
  }

  const getStockBar = (totalStock: number, reorderLevel: number) => {
    const level = getStockLevel(totalStock, reorderLevel)
    const percentage = Math.min((totalStock / Math.max(reorderLevel * 3, 1)) * 100, 100)
    
    let barColor = "bg-[#16a34a]" // green for good stock
    if (level === "low") barColor = "bg-[#dc2626]" // red for low stock
    else if (level === "medium") barColor = "bg-[#ea580c]" // orange for medium stock
    else if (level === "out") barColor = "bg-[#6b7280]" // gray for out of stock

    return (
      <div className="w-full">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium">
            {totalStock} / {reorderLevel} min
          </span>
        </div>
        <div className="w-full bg-[#f3f4f6] rounded-full h-2">
          <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
        </div>
      </div>
    )
  }

  const getExpiryInfo = (batches: Product['batches']) => {
    if (!batches || batches.length === 0) {
      return { text: "No batches", color: "text-gray-400", days: null }
    }

    const sortedBatches = [...batches].sort((a, b) => 
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    )
    
    const nearestExpiry = sortedBatches[0]
    const expiryDate = new Date(nearestExpiry.expiryDate)
    const today = new Date()
    const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysToExpiry < 0) {
      return { text: "Expired", color: "text-[#dc2626]", days: Math.abs(daysToExpiry) }
    } else if (daysToExpiry <= 30) {
      return { text: expiryDate.toLocaleDateString(), color: "text-[#dc2626]", days: daysToExpiry }
    } else if (daysToExpiry <= 90) {
      return { text: expiryDate.toLocaleDateString(), color: "text-[#ea580c]", days: daysToExpiry }
    } else {
      return { text: expiryDate.toLocaleDateString(), color: "text-[#16a34a]", days: daysToExpiry }
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-[#e5e7eb]">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-[#e5e7eb]">
      <div className="p-6 border-b border-[#e5e7eb]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#111827]">Product Inventory</h2>
          <div className="flex items-center gap-4 text-sm text-[#6b7280]">
            <span>Showing 1-20 of 1,247 products</span>
            <select className="border border-[#e5e7eb] rounded px-2 py-1">
              <option>20 per page</option>
              <option>50 per page</option>
              <option>100 per page</option>
            </select>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#e5e7eb]">
            <TableHead className="w-12 pl-5">
              <Checkbox />
            </TableHead>
            <TableHead className="text-[#6b7280] font-medium">Product</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Category</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Stock</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Location</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Price</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Batch & Expiry</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Supplier</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Last Updated</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
              <TableCell className="pl-5">
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${product.iconColor} rounded-lg flex items-center justify-center text-lg`}>
                    {product.icon}
                  </div>
                  <div>
                    <div className="font-medium text-[#111827]">{product.name}</div>
                    <div className="text-sm text-[#6b7280]">SKU: {product.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${product.categoryColor} border-0 font-medium`}>{product.category}</Badge>
              </TableCell>
              <TableCell>
                <div className="w-24">{getStockBar(product.stock)}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium text-[#111827]">{product.location}</div>
                  <div className="text-xs text-[#6b7280]">Rack: {product.location}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-[#111827]">{product.price}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium text-[#111827]">{product.batch}</div>
                  <div className={`text-xs ${product.expiryColor} flex items-center gap-1`}>
                    {product.expiryDays <= 30 && <AlertTriangle className="w-3 h-3" />}
                    {product.expiry}
                  </div>
                  <div className="text-xs text-[#6b7280]">
                    {product.expiryDays <= 30 ? `${product.expiryDays} days left` : 
                     product.expiryDays <= 90 ? `${product.expiryDays} days` : 'Good'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium text-[#111827]">{product.supplier}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs text-[#6b7280]">{product.lastUpdated}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 flex-wrap">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-8 w-8"
                    onClick={() => onEditProduct?.(product)}
                    title="Edit Product"
                  >
                    <Edit className="w-4 h-4 text-[#6b7280]" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-8 w-8"
                    onClick={() => onViewBatch?.(product)}
                    title="View Batch Details"
                  >
                    <Eye className="w-4 h-4 text-[#6b7280]" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-8 w-8"
                    title="Stock Analytics"
                  >
                    <BarChart3 className="w-4 h-4 text-[#6b7280]" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-8 w-8"
                    title="Reorder Stock"
                  >
                    <Package2 className="w-4 h-4 text-[#6b7280]" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-4 border-t border-[#e5e7eb] flex items-center justify-between">
        <div className="text-sm text-[#6b7280]">Showing 1 to 20 of 1,247 results</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border border-[#e5e7eb] rounded hover:bg-[#f9fafb]">Previous</button>
          <button className="px-3 py-1 text-sm bg-[#0f766e] text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-[#e5e7eb] rounded hover:bg-[#f9fafb]">2</button>
          <button className="px-3 py-1 text-sm border border-[#e5e7eb] rounded hover:bg-[#f9fafb]">3</button>
          <button className="px-3 py-1 text-sm border border-[#e5e7eb] rounded hover:bg-[#f9fafb]">Next</button>
        </div>
      </div>
    </div>
  )
}
