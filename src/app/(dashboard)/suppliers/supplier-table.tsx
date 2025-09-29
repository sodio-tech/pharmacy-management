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
          <div className="flex space-x-6">
            <button className="text-sm font-medium text-teal-600 border-b-2 border-teal-600 pb-2">All Suppliers</button>
            <button className="text-sm font-medium text-muted-foreground pb-2">Purchase Orders</button>
            <button className="text-sm font-medium text-muted-foreground pb-2">Payments</button>
            <button className="text-sm font-medium text-muted-foreground pb-2">Performance</button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search suppliers..." className="pl-10" />
          </div>
          <Select defaultValue="all-categories">
            <SelectTrigger className="w-48">
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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
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

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">Showing 1 to 10 of 24 results</p>
          <div className="flex items-center space-x-2">
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
