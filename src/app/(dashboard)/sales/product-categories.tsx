import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Scan } from "lucide-react"

export function ProductCategories() {
  const categories = [
    { name: "Pain Relief", icon: "💊", color: "bg-blue-100 text-blue-700" },
    { name: "Antibiotics", icon: "🦠", color: "bg-green-100 text-green-700" },
    { name: "Cardiac", icon: "💜", color: "bg-purple-100 text-purple-700" },
    { name: "Respiratory", icon: "🫁", color: "bg-orange-100 text-orange-700" },
    { name: "Diabetes", icon: "🩸", color: "bg-red-100 text-red-700" },
    { name: "All", icon: "➕", color: "bg-gray-100 text-gray-700" },
  ]

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search products by name, barcode, or category..." className="pl-10" />
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Scan className="h-4 w-4 mr-2" />
          Scan
        </Button>
      </div>

      {/* Category Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant="outline"
            className={`h-20 flex-col space-y-2 ${category.color} border-2 hover:scale-105 transition-transform`}
          >
            <span className="text-2xl">{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
