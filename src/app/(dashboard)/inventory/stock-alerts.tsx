"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TriangleAlert as AlertTriangle, Clock, Package, ShoppingCart, Bell, X, Plus, Truck } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface StockAlert {
  id: string
  productName: string
  currentStock: number
  minStock: number
  category: string
  location: string
  lastUpdated: string
  urgency: 'critical' | 'warning' | 'info'
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired'
  expiryDate?: string
  batchNumber?: string
  supplier?: string
  suggestedOrderQty?: number
}

const mockAlerts: StockAlert[] = [
  {
    id: "1",
    productName: "Paracetamol 500mg",
    currentStock: 5,
    minStock: 50,
    category: "OTC Medicines",
    location: "A1-B2",
    lastUpdated: "2 hours ago",
    urgency: 'critical',
    type: 'low_stock',
    supplier: "MediCore Pharmaceuticals",
    suggestedOrderQty: 200
  },
  {
    id: "2",
    productName: "Amoxicillin 250mg",
    currentStock: 0,
    minStock: 30,
    category: "Prescription Medicines", 
    location: "B2-C3",
    lastUpdated: "30 minutes ago",
    urgency: 'critical',
    type: 'out_of_stock',
    supplier: "HealthPlus Distributors",
    suggestedOrderQty: 100
  },
  {
    id: "3",
    productName: "Cough Syrup",
    currentStock: 25,
    minStock: 20,
    category: "OTC Medicines",
    location: "C1-A1",
    lastUpdated: "1 hour ago",
    urgency: 'critical',
    type: 'expiring_soon',
    expiryDate: "2025-01-20",
    batchNumber: "CS001"
  },
  {
    id: "4",
    productName: "Vitamin D3 1000 IU",
    currentStock: 18,
    minStock: 25,
    category: "Supplements",
    location: "D1-A2",
    lastUpdated: "4 hours ago",
    urgency: 'warning',
    type: 'low_stock',
    supplier: "Wellness Supplements Ltd",
    suggestedOrderQty: 150
  },
  {
    id: "5",
    productName: "Expired Insulin",
    currentStock: 10,
    minStock: 15,
    category: "Prescription Medicines",
    location: "Cold Storage",
    lastUpdated: "1 day ago",
    urgency: 'critical',
    type: 'expired',
    expiryDate: "2024-12-15",
    batchNumber: "INS005"
  }
]

export function StockAlerts() {
  const [alerts, setAlerts] = useState<StockAlert[]>(mockAlerts)
  const [filter, setFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("urgency")
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <AlertTriangle className="w-5 h-5" />
      case 'out_of_stock': return <Package className="w-5 h-5" />
      case 'expiring_soon': return <Clock className="w-5 h-5" />
      case 'expired': return <X className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getAlertColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'low_stock': return 'bg-orange-100 text-orange-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      case 'expiring_soon': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true
    return alert.type === filter
  })

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortBy === "urgency") {
      const urgencyOrder = { critical: 3, warning: 2, info: 1 }
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
    }
    if (sortBy === "stock") {
      return a.currentStock - b.currentStock
    }
    if (sortBy === "name") {
      return a.productName.localeCompare(b.productName)
    }
    return 0
  })

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
  }

  const handleBulkAction = (action: string) => {
    if (action === "dismiss") {
      setAlerts(alerts.filter(alert => !selectedAlerts.includes(alert.id)))
      setSelectedAlerts([])
    } else if (action === "reorder") {
      // Handle bulk reorder logic
      console.log("Bulk reorder for:", selectedAlerts)
    }
  }

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    )
  }

  const alertCounts = {
    all: alerts.length,
    low_stock: alerts.filter(a => a.type === 'low_stock').length,
    out_of_stock: alerts.filter(a => a.type === 'out_of_stock').length,
    expiring_soon: alerts.filter(a => a.type === 'expiring_soon').length,
    expired: alerts.filter(a => a.type === 'expired').length
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Stock Alerts</CardTitle>
              <p className="text-gray-600 text-sm">Monitor and manage inventory alerts</p>
            </div>
          </div>
          <Badge variant="destructive" className="text-sm">
            {alerts.length} Active Alerts
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Alerts", count: alertCounts.all },
            { key: "low_stock", label: "Low Stock", count: alertCounts.low_stock },
            { key: "out_of_stock", label: "Out of Stock", count: alertCounts.out_of_stock },
            { key: "expiring_soon", label: "Expiring Soon", count: alertCounts.expiring_soon },
            { key: "expired", label: "Expired", count: alertCounts.expired }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.key)}
              className={filter === tab.key ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgency">Sort by Urgency</SelectItem>
                <SelectItem value="stock">Sort by Stock Level</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>

            {selectedAlerts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedAlerts.length} selected
                </span>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("dismiss")}>
                  Dismiss Selected
                </Button>
                <Button size="sm" onClick={() => handleBulkAction("reorder")}>
                  Bulk Reorder
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          <AnimatePresence>
            {sortedAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`p-4 rounded-lg border ${getAlertColor(alert.urgency)} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(alert.id)}
                    onChange={() => handleSelectAlert(alert.id)}
                    className="mt-1 rounded border-gray-300"
                  />
                  
                  <div className={`p-2 rounded-lg ${getAlertColor(alert.urgency)}`}>
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{alert.productName}</h4>
                        <p className="text-sm text-gray-600">{alert.category} • {alert.location}</p>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getAlertBadgeColor(alert.type)}>
                            {alert.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          
                          {alert.type === 'low_stock' || alert.type === 'out_of_stock' ? (
                            <span className="text-sm text-gray-600">
                              Stock: <span className="font-medium">{alert.currentStock}</span> / Min: {alert.minStock}
                            </span>
                          ) : null}
                          
                          {alert.expiryDate && (
                            <span className="text-sm text-gray-600">
                              Expires: <span className="font-medium">{alert.expiryDate}</span>
                            </span>
                          )}
                          
                          {alert.batchNumber && (
                            <span className="text-sm text-gray-600">
                              Batch: <span className="font-medium">{alert.batchNumber}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {alert.type === 'low_stock' || alert.type === 'out_of_stock' ? (
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Reorder ({alert.suggestedOrderQty})
                          </Button>
                        ) : null}
                        
                        {alert.type === 'expired' || alert.type === 'expiring_soon' ? (
                          <Button size="sm" variant="outline">
                            <Truck className="w-4 h-4 mr-2" />
                            Return to Supplier
                          </Button>
                        ) : null}
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDismissAlert(alert.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        Last updated: {alert.lastUpdated}
                      </span>
                      
                      {alert.supplier && (
                        <span className="text-xs text-gray-500">
                          Supplier: {alert.supplier}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {sortedAlerts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600">
              {filter === "all" 
                ? "All your inventory levels are healthy!" 
                : `No ${filter.replace('_', ' ')} alerts at the moment.`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}