import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Star } from "lucide-react"

const suppliers = [
  {
    id: 1,
    name: "MediCore Pharmaceuticals",
    gstin: "29ABCDE1234F1Z5",
    category: "Pharmaceuticals",
    contact: "Rajesh Kumar",
    phone: "+91 98765 43210",
    lastOrder: "Dec 15, 2024",
    totalSpend: "₹2,45,000",
    rating: 4.8,
    status: "Active",
    icon: "MP",
    iconColor: "bg-blue-500",
  },
  {
    id: 2,
    name: "HealthPlus Distributors",
    gstin: "27FGHIJ5678K2L6",
    category: "Medical Devices",
    contact: "Priya Sharma",
    phone: "+91 87654 32109",
    lastOrder: "Dec 18, 2024",
    totalSpend: "₹1,85,000",
    rating: 4.2,
    status: "Active",
    icon: "HD",
    iconColor: "bg-green-500",
  },
  {
    id: 3,
    name: "Wellness Supplements Ltd",
    gstin: "19MNOPQ9012R3S7",
    category: "Supplements",
    contact: "Amit Patel",
    phone: "+91 76543 21098",
    lastOrder: "Dec 10, 2024",
    totalSpend: "₹95,000",
    rating: 4.9,
    status: "Pending",
    icon: "WS",
    iconColor: "bg-purple-500",
  },
]

export function SupplierTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex space-x-6 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            <button className="text-sm font-medium text-teal-600 border-b-2 border-teal-600 pb-2 whitespace-nowrap">
              All Suppliers
            </button>
            <button className="text-sm font-medium text-muted-foreground pb-2 whitespace-nowrap">
              Purchase Orders
            </button>
            <button className="text-sm font-medium text-muted-foreground pb-2 whitespace-nowrap">Payments</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search suppliers..." className="pl-10" />
          </div>
          <Select defaultValue="all-categories">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
              <SelectItem value="medical-devices">Medical Devices</SelectItem>
              <SelectItem value="supplements">Supplements</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Supplier</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Order</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Spend</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className={`h-10 w-10 ${supplier.iconColor}`}>
                        <AvatarFallback className="text-white font-semibold">{supplier.icon}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">GSTIN: {supplier.gstin}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="secondary">{supplier.category}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">{supplier.contact}</p>
                      <p className="text-sm text-muted-foreground">{supplier.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">{supplier.lastOrder}</td>
                  <td className="py-4 px-4 font-medium">{supplier.totalSpend}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(supplier.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={supplier.status === "Active" ? "default" : "secondary"}
                      className={
                        supplier.status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                      }
                    >
                      {supplier.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-4">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <Avatar className={`h-12 w-12 flex-shrink-0 ${supplier.iconColor}`}>
                    <AvatarFallback className="text-white font-semibold">{supplier.icon}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base">{supplier.name}</p>
                    <p className="text-sm text-muted-foreground truncate">GSTIN: {supplier.gstin}</p>
                  </div>
                  <Badge
                    variant={supplier.status === "Active" ? "default" : "secondary"}
                    className={
                      supplier.status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                    }
                  >
                    {supplier.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge variant="secondary">{supplier.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contact</span>
                    <div className="text-right">
                      <p className="text-sm font-medium">{supplier.contact}</p>
                      <p className="text-xs text-muted-foreground">{supplier.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Order</span>
                    <span className="text-sm font-medium">{supplier.lastOrder}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Spend</span>
                    <span className="text-sm font-medium">{supplier.totalSpend}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(supplier.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <p className="text-sm text-muted-foreground">Showing 1 to 10 of 24 results</p>
          <div className="flex items-center flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
