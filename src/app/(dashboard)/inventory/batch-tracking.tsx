"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar, Package, AlertTriangle, Truck, Eye, Download } from "lucide-react"

interface BatchInfo {
  id: string
  productName: string
  batchNumber: string
  manufacturingDate: string
  expiryDate: string
  quantity: number
  remainingQty: number
  supplier: string
  manufacturer: string
  location: string
  status: 'active' | 'expiring_soon' | 'expired' | 'recalled'
  costPrice: number
  mrp: number
  gstRate: number
  qualityCheck: 'passed' | 'pending' | 'failed'
  receivedDate: string
  lastSold: string
}

const mockBatches: BatchInfo[] = [
  {
    id: "1",
    productName: "Paracetamol 500mg",
    batchNumber: "PCM20241201",
    manufacturingDate: "2024-06-15",
    expiryDate: "2026-06-14",
    quantity: 1000,
    remainingQty: 850,
    supplier: "MediCore Pharmaceuticals",
    manufacturer: "ABC Pharma Ltd",
    location: "A1-B2",
    status: 'active',
    costPrice: 18.50,
    mrp: 25.00,
    gstRate: 12,
    qualityCheck: 'passed',
    receivedDate: "2024-12-01",
    lastSold: "2 hours ago"
  },
  {
    id: "2",
    productName: "Amoxicillin 250mg",
    batchNumber: "AMX20241115",
    manufacturingDate: "2024-05-20",
    expiryDate: "2025-05-19",
    quantity: 500,
    remainingQty: 125,
    supplier: "HealthPlus Distributors",
    manufacturer: "XYZ Pharmaceuticals",
    location: "B2-C3",
    status: 'expiring_soon',
    costPrice: 65.00,
    mrp: 85.00,
    gstRate: 12,
    qualityCheck: 'passed',
    receivedDate: "2024-11-15",
    lastSold: "1 day ago"
  },
  {
    id: "3",
    productName: "Cough Syrup",
    batchNumber: "CS20240801",
    manufacturingDate: "2024-02-10",
    expiryDate: "2025-01-20",
    quantity: 200,
    remainingQty: 45,
    supplier: "Wellness Distributors",
    manufacturer: "Herbal Remedies Inc",
    location: "C1-A1",
    status: 'expiring_soon',
    costPrice: 120.00,
    mrp: 165.00,
    gstRate: 18,
    qualityCheck: 'passed',
    receivedDate: "2024-08-01",
    lastSold: "3 hours ago"
  },
  {
    id: "4",
    productName: "Insulin Injection",
    batchNumber: "INS20240901",
    manufacturingDate: "2024-03-15",
    expiryDate: "2024-12-15",
    quantity: 100,
    remainingQty: 25,
    supplier: "Diabetes Care Ltd",
    manufacturer: "Premium Biologics",
    location: "Cold Storage",
    status: 'expired',
    costPrice: 450.00,
    mrp: 580.00,
    gstRate: 5,
    qualityCheck: 'passed',
    receivedDate: "2024-09-01",
    lastSold: "1 week ago"
  },
  {
    id: "5",
    productName: "Vitamin D3 1000 IU",
    batchNumber: "VD320241010",
    manufacturingDate: "2024-04-25",
    expiryDate: "2026-04-24",
    quantity: 800,
    remainingQty: 650,
    supplier: "Wellness Supplements Ltd",
    manufacturer: "NutriHealth Corp",
    location: "D1-A2",
    status: 'active',
    costPrice: 140.00,
    mrp: 180.00,
    gstRate: 18,
    qualityCheck: 'passed',
    receivedDate: "2024-10-10",
    lastSold: "30 minutes ago"
  }
]

export function BatchTracking() {
  const [batches, setBatches] = useState<BatchInfo[]>(mockBatches)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("expiryDate")
  const [selectedBatches, setSelectedBatches] = useState<string[]>([])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expiring_soon': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'recalled': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getQualityCheckColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const sortedBatches = [...filteredBatches].sort((a, b) => {
    switch (sortBy) {
      case 'expiryDate':
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      case 'quantity':
        return b.remainingQty - a.remainingQty
      case 'productName':
        return a.productName.localeCompare(b.productName)
      case 'receivedDate':
        return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()
      default:
        return 0
    }
  })

  const handleSelectBatch = (batchId: string) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    )
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for batches:`, selectedBatches)
    // Implement bulk actions like return to supplier, mark as recalled, etc.
  }

  const statusCounts = {
    all: batches.length,
    active: batches.filter(b => b.status === 'active').length,
    expiring_soon: batches.filter(b => b.status === 'expiring_soon').length,
    expired: batches.filter(b => b.status === 'expired').length,
    recalled: batches.filter(b => b.status === 'recalled').length
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Batch & Lot Tracking</CardTitle>
              <p className="text-gray-600 text-sm">Monitor batch details, expiry dates, and quality status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: "all", label: "Total Batches", count: statusCounts.all, color: "bg-gray-100 text-gray-800" },
            { key: "active", label: "Active", count: statusCounts.active, color: "bg-green-100 text-green-800" },
            { key: "expiring_soon", label: "Expiring Soon", count: statusCounts.expiring_soon, color: "bg-yellow-100 text-yellow-800" },
            { key: "expired", label: "Expired", count: statusCounts.expired, color: "bg-red-100 text-red-800" },
            { key: "recalled", label: "Recalled", count: statusCounts.recalled, color: "bg-purple-100 text-purple-800" }
          ].map((stat) => (
            <div key={stat.key} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.color} mb-2`}>
                <span className="text-xl font-bold">{stat.count}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by product name, batch number, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="recalled">Recalled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expiryDate">Expiry Date</SelectItem>
              <SelectItem value="quantity">Remaining Quantity</SelectItem>
              <SelectItem value="productName">Product Name</SelectItem>
              <SelectItem value="receivedDate">Received Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedBatches.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              {selectedBatches.length} batch(es) selected
            </span>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("return")}>
              <Truck className="w-4 h-4 mr-2" />
              Return to Supplier
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("recall")}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Mark as Recalled
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelectedBatches([])}>
              Clear Selection
            </Button>
          </div>
        )}

        {/* Batch Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedBatches.length === sortedBatches.length && sortedBatches.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBatches(sortedBatches.map(b => b.id))
                      } else {
                        setSelectedBatches([])
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Product & Batch</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBatches.map((batch) => {
                const daysUntilExpiry = getDaysUntilExpiry(batch.expiryDate)
                return (
                  <TableRow key={batch.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedBatches.includes(batch.id)}
                        onChange={() => handleSelectBatch(batch.id)}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{batch.productName}</p>
                        <p className="text-sm text-gray-600">Batch: {batch.batchNumber}</p>
                        <p className="text-xs text-gray-500">{batch.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-gray-900">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Mfg: {new Date(batch.manufacturingDate).toLocaleDateString()}
                        </p>
                        <p className={`${daysUntilExpiry <= 30 ? 'text-red-600' : daysUntilExpiry <= 90 ? 'text-yellow-600' : 'text-gray-600'}`}>
                          Exp: {new Date(batch.expiryDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : `Expired ${Math.abs(daysUntilExpiry)} days ago`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{batch.remainingQty} / {batch.quantity}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              (batch.remainingQty / batch.quantity) > 0.5 ? 'bg-green-500' :
                              (batch.remainingQty / batch.quantity) > 0.2 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(batch.remainingQty / batch.quantity) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {((batch.remainingQty / batch.quantity) * 100).toFixed(1)}% remaining
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{batch.supplier}</p>
                        <p className="text-gray-600">{batch.manufacturer}</p>
                        <p className="text-xs text-gray-500">Received: {new Date(batch.receivedDate).toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getQualityCheckColor(batch.qualityCheck)}>
                        {batch.qualityCheck.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {batch.status === 'expired' || batch.status === 'expiring_soon' ? (
                          <Button variant="ghost" size="sm" className="text-orange-600">
                            <Truck className="w-4 h-4" />
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {sortedBatches.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No batch information available."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}