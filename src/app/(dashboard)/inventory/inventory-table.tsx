import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Edit, Plus, Minus, Trash2, Eye, BarChart3, Package2, AlertTriangle } from "lucide-react"

const products = [
  {
    id: "MED001",
    name: "Paracetamol 500mg",
    category: "Prescription",
    categoryColor: "bg-[#dbeafe] text-[#2563eb]",
    stock: { current: 5, total: 100, level: "low" },
    price: "₹12.50",
    batch: "BAT001",
    expiry: "Dec 2024",
    expiryColor: "text-[#dc2626]", 
    expiryDays: 15,
    icon: "💊",
    iconColor: "bg-[#dbeafe]",
    supplier: "MediCore Pharmaceuticals",
    location: "A1-B2",
    lastUpdated: "2 hours ago"
  },
  {
    id: "MED002",
    name: "Amoxicillin 250mg",
    category: "Prescription",
    categoryColor: "bg-[#dbeafe] text-[#2563eb]",
    stock: { current: 12, total: 50, level: "medium" },
    price: "₹25.00",
    batch: "BAT002",
    expiry: "Mar 2025",
    expiryColor: "text-[#16a34a]",
    expiryDays: 95,
    icon: "💊",
    iconColor: "bg-[#dcfce7]",
    supplier: "HealthPlus Distributors", 
    location: "B2-C3",
    lastUpdated: "1 day ago"
  },
  {
    id: "SUP001",
    name: "Vitamin D3 1000 IU",
    category: "Supplement",
    categoryColor: "bg-[#dcfce7] text-[#16a34a]",
    stock: { current: 85, total: 20, level: "high" },
    price: "₹180.00",
    batch: "BAT003",
    expiry: "Jan 2025",
    expiryColor: "text-[#16a34a]",
    expiryDays: 45,
    icon: "🌟",
    iconColor: "bg-[#f3e8ff]",
    supplier: "Wellness Supplements Ltd",
    location: "C1-A1", 
    lastUpdated: "30 minutes ago"
  },
  {
    id: "MED003",
    name: "Ibuprofen 400mg",
    category: "OTC",
    categoryColor: "bg-[#fef9c3] text-[#ca8a04]",
    stock: { current: 0, total: 30, level: "out" },
    price: "₹18.00",
    batch: "BAT004",
    expiry: "Jun 2025",
    expiryColor: "text-[#16a34a]",
    expiryDays: 180,
    icon: "💊",
    iconColor: "bg-[#fee2e2]",
    supplier: "Generic Medicines Co",
    location: "A2-B1",
    lastUpdated: "Out of stock"
  },
]

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
