"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Scan, Save, TriangleAlert as AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: any) => void
}

export function AddProductModal({ isOpen, onClose, onSave }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    brand: "",
    category: "",
    type: "",
    strength: "",
    dosageForm: "",
    packSize: "",
    barcode: "",
    sku: "",
    description: "",
    manufacturer: "",
    supplier: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
    mrp: "",
    costPrice: "",
    sellingPrice: "",
    gstRate: "12",
    minStockLevel: "",
    maxStockLevel: "",
    currentStock: "",
    location: "",
    rackNumber: "",
    prescriptionRequired: false,
    controlledSubstance: false,
    scheduleType: "",
  })

  const [activeTab, setActiveTab] = useState("basic")

  const categories = [
    "Prescription Medicines",
    "OTC",
    "Supplements & Vitamins",
    "Medical Devices",
    "Personal Care",
    "Baby Care",
    "First Aid",
    "Ayurvedic/Herbal"
  ]

  const dosageForms = [
    "Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment",
    "Drops", "Inhaler", "Powder", "Gel", "Lotion", "Spray"
  ]

  const scheduleTypes = [
    "Schedule H", "Schedule H1", "Schedule X", "Schedule G", "Non-Scheduled"
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    // Validate required fields
    const requiredFields = ['name', 'category', 'sellingPrice']
    const missingFields = requiredFields.filter(field => !formData[field])

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`)
      return
    }

    // Generate SKU if not provided
    const sku = formData.sku || formData.barcode || `PRD${Date.now()}`

    // Transform data for backend API
    const productData = {
      sku: sku,
      name: formData.name,
      description: formData.description || "",
      category: formData.category,
      unit: formData.packSize || "tablets",
      hsnCode: "",
      gstRate: parseInt(formData.gstRate) || 12,
      price: parseFloat(formData.sellingPrice) || 0,
      reorderLevel: parseInt(formData.minStockLevel) || 10,
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        console.log("Product saved successfully")
        onSave(formData)
        onClose()

        // Reset form
        setFormData({
          name: "", genericName: "", brand: "", category: "", type: "", strength: "",
          dosageForm: "", packSize: "", barcode: "", sku: "", description: "",
          manufacturer: "", supplier: "", batchNumber: "", manufacturingDate: "",
          expiryDate: "", mrp: "", costPrice: "", sellingPrice: "", gstRate: "12",
          minStockLevel: "", maxStockLevel: "", currentStock: "", location: "",
          rackNumber: "", prescriptionRequired: false, controlledSubstance: false,
          scheduleType: "",
        })
      } else {
        const error = await response.json()
        alert(`Failed to save product: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Failed to save product. Please try again.")
    }
  }

  const tabs = [
    { id: "basic", label: "Basic Info", icon: "📋" },
    { id: "pricing", label: "Pricing", icon: "💰" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "batch", label: "Batch Details", icon: "🏷️" },
    { id: "compliance", label: "Compliance", icon: "⚖️" }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <p className="text-gray-600 mt-1">Enter product details and inventory information</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? "border-teal-600 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="genericName">Generic Name</Label>
                    <Input
                      id="genericName"
                      value={formData.genericName}
                      onChange={(e) => handleInputChange("genericName", e.target.value)}
                      placeholder="Enter generic name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strength">Strength</Label>
                    <Input
                      id="strength"
                      value={formData.strength}
                      onChange={(e) => handleInputChange("strength", e.target.value)}
                      placeholder="e.g., 500mg, 10ml"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dosageForm">Dosage Form</Label>
                    <Select value={formData.dosageForm} onValueChange={(value) => handleInputChange("dosageForm", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dosage form" />
                      </SelectTrigger>
                      <SelectContent>
                        {dosageForms.map((form) => (
                          <SelectItem key={form} value={form}>
                            {form}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="packSize">Pack Size</Label>
                    <Input
                      id="packSize"
                      value={formData.packSize}
                      onChange={(e) => handleInputChange("packSize", e.target.value)}
                      placeholder="e.g., 10 tablets, 100ml"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="barcode">Barcode/SKU</Label>
                      <Input
                        id="barcode"
                        value={formData.barcode}
                        onChange={(e) => handleInputChange("barcode", e.target.value)}
                        placeholder="Enter or scan barcode"
                      />
                    </div>
                    <Button variant="outline" className="mt-6">
                      <Scan className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mrp">MRP *</Label>
                    <Input
                      id="mrp"
                      type="number"
                      value={formData.mrp}
                      onChange={(e) => handleInputChange("mrp", e.target.value)}
                      placeholder="Maximum Retail Price"
                    />
                  </div>
                  <div>
                    <Label htmlFor="costPrice">Cost Price</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      value={formData.costPrice}
                      onChange={(e) => handleInputChange("costPrice", e.target.value)}
                      placeholder="Purchase cost"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellingPrice">Selling Price *</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      value={formData.sellingPrice}
                      onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
                      placeholder="Selling price"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gstRate">GST Rate (%)</Label>
                    <Select value={formData.gstRate} onValueChange={(value) => handleInputChange("gstRate", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="18">18%</SelectItem>
                        <SelectItem value="28">28%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Profit Margin Display */}
                  {formData.costPrice && formData.sellingPrice && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <Label className="text-green-800">Profit Margin</Label>
                      <p className="text-2xl font-bold text-green-600">
                        {(((parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice)) / parseFloat(formData.costPrice)) * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-green-600">
                        ₹{(parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice)).toFixed(2)} profit per unit
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "inventory" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentStock">Current Stock *</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={formData.currentStock}
                      onChange={(e) => handleInputChange("currentStock", e.target.value)}
                      placeholder="Current stock quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      value={formData.minStockLevel}
                      onChange={(e) => handleInputChange("minStockLevel", e.target.value)}
                      placeholder="Reorder level"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxStockLevel">Maximum Stock Level</Label>
                    <Input
                      id="maxStockLevel"
                      type="number"
                      value={formData.maxStockLevel}
                      onChange={(e) => handleInputChange("maxStockLevel", e.target.value)}
                      placeholder="Maximum stock to maintain"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Storage Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g., Main Store, Cold Storage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rackNumber">Rack/Shelf Number</Label>
                    <Input
                      id="rackNumber"
                      value={formData.rackNumber}
                      onChange={(e) => handleInputChange("rackNumber", e.target.value)}
                      placeholder="e.g., A1-B2"
                    />
                  </div>

                  {/* Stock Status Indicator */}
                  {formData.currentStock && formData.minStockLevel && (
                    <div className={`p-4 rounded-lg ${parseInt(formData.currentStock) <= parseInt(formData.minStockLevel)
                        ? "bg-red-50 border border-red-200"
                        : "bg-green-50 border border-green-200"
                      }`}>
                      <div className="flex items-center gap-2">
                        {parseInt(formData.currentStock) <= parseInt(formData.minStockLevel) ? (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        ) : (
                          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        <span className={`font-medium ${parseInt(formData.currentStock) <= parseInt(formData.minStockLevel)
                            ? "text-red-800"
                            : "text-green-800"
                          }`}>
                          {parseInt(formData.currentStock) <= parseInt(formData.minStockLevel)
                            ? "Low Stock Alert"
                            : "Stock Level OK"
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "batch" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="batchNumber">Batch Number</Label>
                    <Input
                      id="batchNumber"
                      value={formData.batchNumber}
                      onChange={(e) => handleInputChange("batchNumber", e.target.value)}
                      placeholder="Enter batch number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
                    <Input
                      id="manufacturingDate"
                      type="date"
                      value={formData.manufacturingDate}
                      onChange={(e) => handleInputChange("manufacturingDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                      placeholder="Manufacturer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) => handleInputChange("supplier", e.target.value)}
                      placeholder="Supplier name"
                    />
                  </div>

                  {/* Expiry Alert */}
                  {formData.expiryDate && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Label className="text-yellow-800">Expiry Status</Label>
                      <p className="text-sm text-yellow-700 mt-1">
                        {(() => {
                          const today = new Date()
                          const expiry = new Date(formData.expiryDate)
                          const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                          if (daysUntilExpiry < 0) {
                            return `⚠️ Expired ${Math.abs(daysUntilExpiry)} days ago`
                          } else if (daysUntilExpiry <= 30) {
                            return `⚠️ Expires in ${daysUntilExpiry} days`
                          } else {
                            return `✅ ${daysUntilExpiry} days until expiry`
                          }
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "compliance" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="prescriptionRequired"
                        checked={formData.prescriptionRequired}
                        onChange={(e) => handleInputChange("prescriptionRequired", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="prescriptionRequired">Prescription Required</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="controlledSubstance"
                        checked={formData.controlledSubstance}
                        onChange={(e) => handleInputChange("controlledSubstance", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="controlledSubstance">Controlled Substance</Label>
                    </div>

                    {formData.controlledSubstance && (
                      <div>
                        <Label htmlFor="scheduleType">Schedule Type</Label>
                        <Select value={formData.scheduleType} onValueChange={(value) => handleInputChange("scheduleType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule type" />
                          </SelectTrigger>
                          <SelectContent>
                            {scheduleTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Compliance Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Prescription Required:</span>
                          <Badge variant={formData.prescriptionRequired ? "destructive" : "secondary"}>
                            {formData.prescriptionRequired ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Controlled Substance:</span>
                          <Badge variant={formData.controlledSubstance ? "destructive" : "secondary"}>
                            {formData.controlledSubstance ? "Yes" : "No"}
                          </Badge>
                        </div>
                        {formData.controlledSubstance && formData.scheduleType && (
                          <div className="flex justify-between">
                            <span>Schedule:</span>
                            <Badge variant="outline">{formData.scheduleType}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              * Required fields must be filled
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
                <Save className="w-4 h-4 mr-2" />
                Save Product
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}