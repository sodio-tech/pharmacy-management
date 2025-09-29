
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Scan, Download, Filter, List, Grid } from "lucide-react"
import { InventoryStats } from "./inventory-stats"
import { InventoryTable } from "./inventory-table"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"

function InventoryContent() {
  return (
    <div className="bg-[#f9fafb]">
      <InventoryStats />

      {/* Search and Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg border border-[#e5e7eb]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
            <Input placeholder="Search by name, batch, or barcode..." className="pl-10 bg-white border-[#e5e7eb]" />
          </div>

          <Select defaultValue="all-categories">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="prescription">Prescription</SelectItem>
              <SelectItem value="otc">OTC</SelectItem>
              <SelectItem value="supplement">Supplement</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-stock">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-stock">All Stock Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
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

      <InventoryTable />
    </div>
  )
}

export default function InventoryManagement() {
  return (
    <LayoutSkeleton
      header={
        <DynamicHeader
          maintext="Inventory Management"
          para="Manage your pharmacy stock and medicine inventory"
          children={
            <div className="flex items-center gap-3">
              <Button className="bg-[#0f766e] hover:bg-[#0d6660] text-white gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
              <Button className="bg-[#14b8a6] hover:bg-[#0f9488] text-white gap-2">
                <Scan className="w-4 h-4" />
                Scan Barcode
              </Button>
              <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          }
        />
      }
    >
      <InventoryContent />
    </LayoutSkeleton>
  )
}
