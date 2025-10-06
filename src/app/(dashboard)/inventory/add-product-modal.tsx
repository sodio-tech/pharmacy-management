"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, Package } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "react-toastify"
import { getSession, useSession } from "@/lib/auth-client"
import { inventoryService, Product } from "@/services/inventoryService"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null // Product to edit (null for add mode)
  onSuccess?: (product: Product) => void // Callback when product is created/updated
}

export function AddProductModal({ isOpen, onClose, product, onSuccess }: AddProductModalProps) {
  const isEditMode = !!product
  
  const [formData, setFormData] = useState({
    // Updated to a different product - Ibuprofen
    name: "Ibuprofen 400mg",
    description: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to treat pain, fever, and inflammation.",
    generic_name: "Ibuprofen",
    manufacturer: "Johnson & Johnson",
    barcode: "9876543210987",
    qr_code: "9876543210987",
    category: "OTC",
    unit_price: "8.50",
    selling_price: "12.75",
    unit_of_measure: "tablets",
    pack_size: "1",
    min_stock_level: "15",
    max_stock_level: "800",
    requires_prescription: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState<string | null>("ADMIN")

  // Populate form when editing
  useEffect(() => {
    if (product && isEditMode) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        generic_name: product.generic_name || "",
        manufacturer: product.manufacturer || "",
        barcode: product.barcode || "",
        qr_code: product.qr_code || "",
        category: product.category || "OTC",
        unit_price: product.unit_price?.toString() || "",
        selling_price: product.selling_price?.toString() || "",
        unit_of_measure: product.unit_of_measure || "tablets",
        pack_size: product.pack_size?.toString() || "1",
        min_stock_level: product.min_stock_level?.toString() || "10",
        max_stock_level: product.max_stock_level?.toString() || "1000",
        requires_prescription: product.requires_prescription || false,
      })
    } 
    // else {
    //   // Reset form for add mode
    //   setFormData({
    //     name: "",
    //     description: "",
    //     generic_name: "",
    //     manufacturer: "",
    //     barcode: "",
    //     qr_code: "",
    //     category: "OTC",
    //     unit_price: "",
    //     selling_price: "",
    //     unit_of_measure: "tablets",
    //     pack_size: "1",
    //     min_stock_level: "10",
    //     max_stock_level: "1000",
    //     requires_prescription: false,
    //   })
    // }
  }, [product, isEditMode])

  const categories = [
    { value: "OTC", label: "OTC (Over The Counter)" },
    { value: "PRESCRIPTION", label: "Prescription Medicines" },
    { value: "SUPPLEMENTS", label: "Supplements & Vitamins" },
    { value: "MEDICAL_DEVICES", label: "Medical Devices" },
    { value: "COSMETICS", label: "Cosmetics" },
    { value: "OTHER", label: "Other" },
  ]

  const unitOfMeasure = ["tablets", "capsules", "ml", "mg", "grams", "units", "bottles", "boxes", "strips", "vials"]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Product name is required")
      return false
    }
    if (!formData.category) {
      setError("Category is required")
      return false
    }
    if (!formData.unit_price || Number.parseFloat(formData.unit_price) <= 0) {
      setError("Valid unit price is required")
      return false
    }
    if (!formData.selling_price || Number.parseFloat(formData.selling_price) <= 0) {
      setError("Valid selling price is required")
      return false
    }
    if (!formData.unit_of_measure) {
      setError("Unit of measure is required")
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        generic_name: formData.generic_name.trim() || undefined,
        manufacturer: formData.manufacturer.trim() || undefined,
        barcode: formData.barcode.trim() || undefined,
        qr_code: formData.qr_code.trim() || undefined,
        category: formData.category,
        unit_price: Number.parseFloat(formData.unit_price),
        selling_price: Number.parseFloat(formData.selling_price),
        unit_of_measure: formData.unit_of_measure,
        pack_size: Number.parseInt(formData.pack_size) || 1,
        min_stock_level: Number.parseInt(formData.min_stock_level) || 10,
        max_stock_level: Number.parseInt(formData.max_stock_level) || 1000,
        requires_prescription: formData.requires_prescription,
      }

      let result: Product

      if (isEditMode && product) {  
        result = await inventoryService.updateProduct(product.id, productData)
        toast.success("Product updated successfully!")
      } else {
        // Create new product
        result = await inventoryService.createProduct(productData)
        toast.success("Product created successfully!")
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result)
      }

      onClose()
    } catch (err: any) {
      const errorMessage = err.message || `Failed to ${isEditMode ? 'update' : 'create'} product`
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      generic_name: "",
      manufacturer: "",
      barcode: "",
      qr_code: "",
      category: "OTC",
      unit_price: "",
      selling_price: "",
      unit_of_measure: "tablets",
      pack_size: "1",
      min_stock_level: "10",
      max_stock_level: "1000",
      requires_prescription: false,
    })
    setError("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {isEditMode ? 'Update the product details below' : 'Fill in the product details below'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-teal-600 rounded-full"></span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Paracetamol 500mg"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="generic_name" className="text-sm font-medium">
                    Generic Name
                  </Label>
                  <Input
                    id="generic_name"
                    value={formData.generic_name}
                    onChange={(e) => handleInputChange("generic_name", e.target.value)}
                    placeholder="e.g., Acetaminophen"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="manufacturer" className="text-sm font-medium">
                    Manufacturer
                  </Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                    placeholder="e.g., Pfizer Inc."
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="requires_prescription"
                    checked={formData.requires_prescription}
                    onChange={(e) => handleInputChange("requires_prescription", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <Label htmlFor="requires_prescription" className="text-sm font-medium cursor-pointer">
                    Requires Prescription
                  </Label>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Product description, usage instructions, etc."
                    rows={3}
                    className="mt-1.5 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Identification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-cyan-600 rounded-full"></span>
                Identification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="barcode" className="text-sm font-medium">
                    Barcode
                  </Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange("barcode", e.target.value)}
                    placeholder="e.g., 1234567890123"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="qr_code" className="text-sm font-medium">
                    QR Code
                  </Label>
                  <Input
                    id="qr_code"
                    value={formData.qr_code}
                    onChange={(e) => handleInputChange("qr_code", e.target.value)}
                    placeholder="QR code data"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit_price" className="text-sm font-medium">
                    Unit Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_price}
                    onChange={(e) => handleInputChange("unit_price", e.target.value)}
                    placeholder="0.00"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="selling_price" className="text-sm font-medium">
                    Selling Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="selling_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.selling_price}
                    onChange={(e) => handleInputChange("selling_price", e.target.value)}
                    placeholder="0.00"
                    className="mt-1.5"
                  />
                </div>

                {formData.unit_price && formData.selling_price && Number.parseFloat(formData.unit_price) > 0 && (
                  <div className="md:col-span-2 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Profit Margin</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                          {(
                            ((Number.parseFloat(formData.selling_price) - Number.parseFloat(formData.unit_price)) /
                              Number.parseFloat(formData.unit_price)) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Profit per Unit</p>
                        <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                          ₹
                          {(
                            Number.parseFloat(formData.selling_price) - Number.parseFloat(formData.unit_price)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Packaging & Stock */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Packaging & Stock Levels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit_of_measure" className="text-sm font-medium">
                    Unit of Measure <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.unit_of_measure}
                    onValueChange={(value) => handleInputChange("unit_of_measure", value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOfMeasure.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pack_size" className="text-sm font-medium">
                    Pack Size
                  </Label>
                  <Input
                    id="pack_size"
                    type="number"
                    min="1"
                    value={formData.pack_size}
                    onChange={(e) => handleInputChange("pack_size", e.target.value)}
                    placeholder="1"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="min_stock_level" className="text-sm font-medium">
                    Minimum Stock Level
                  </Label>
                  <Input
                    id="min_stock_level"
                    type="number"
                    min="0"
                    value={formData.min_stock_level}
                    onChange={(e) => handleInputChange("min_stock_level", e.target.value)}
                    placeholder="10"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="max_stock_level" className="text-sm font-medium">
                    Maximum Stock Level
                  </Label>
                  <Input
                    id="max_stock_level"
                    type="number"
                    min="0"
                    value={formData.max_stock_level}
                    onChange={(e) => handleInputChange("max_stock_level", e.target.value)}
                    placeholder="1000"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at Bottom */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update Product' : 'Save Product'}
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
  )
}
