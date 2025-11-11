"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, Package, Image as ImageIcon, QrCode, ScanLine } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "react-toastify"
import { Product } from "@/types/sales"
import { backendApi } from "@/lib/axios-config"
import { useProductCategories } from "@/hooks/useProductCategories"
import { useProductUnits } from "@/hooks/useProductUnits"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null // Product to edit (null for add mode)
  onSuccess?: (product: Product) => void // Callback when product is created/updated
}

export function AddProductModal({ isOpen, onClose, product, onSuccess }: AddProductModalProps) {
  const isEditMode = !!product
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    generic_name: "",
    manufacturer: "",
    barcode: "",
    qr_code: "",
    category: "",
    product_category_id: "",
    sku: "",
    unit_id: "",
    unit_price: "",
    selling_price: "",
    pack_size: "",
    min_stock_level: "",
    max_stock_level: "",
    requires_prescription: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { categories, isLoading: isLoadingCategories } = useProductCategories()
  const { units, isLoading: isLoadingUnits } = useProductUnits()

  // Populate form when editing
  useEffect(() => {
    if (product && isEditMode && categories.length > 0 && units.length > 0) {
      // Find matching category ID from API categories
      const matchingCategory = categories.find(
        cat => cat.category_name.toLowerCase().replace(/_/g, "-") === product.category?.toLowerCase().replace(/_/g, "-")
      )
      
      // Find matching unit ID from API units
      const matchingUnit = units.find(
        unit => unit.unit.toLowerCase() === product.unit_of_measure?.toLowerCase()
      )
      
      setFormData({
        name: product.name || "",
        description: product.description || "",
        generic_name: product.generic_name || "",
        manufacturer: product.manufacturer || "",
        barcode: product.barcode || "",
        qr_code: product.qr_code || "",
        category: product.category || "",
        product_category_id: matchingCategory?.id.toString() || "",
        sku: "",
        unit_id: matchingUnit?.id.toString() || "",
        unit_price: product.unit_price?.toString() || "",
        selling_price: product.selling_price?.toString() || "",
        pack_size: product.pack_size?.toString() || "1",
        min_stock_level: product.min_stock_level?.toString() || "10",
        max_stock_level: product.max_stock_level?.toString() || "1000",
        requires_prescription: product.requires_prescription || false,
      })
      
      // Set existing image URL if available
      if (product.image_url) {
        setImageUrl(product.image_url)
        setImagePreview(product.image_url)
      }
    } 
  }, [product, isEditMode, categories, units])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB')
      return
    }

    setImageFile(file)
    setError("")

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const generateBarcode = () => {
    // Generate a random 13-digit barcode
    const barcode = Math.floor(1000000000000 + Math.random() * 9000000000000).toString()
    setFormData(prev => ({ ...prev, barcode }))
    toast.success('Barcode generated successfully!')
  }

  const generateQRCode = () => {
    // Generate a random QR code string
    const qrCode = `QR${Date.now()}${Math.floor(Math.random() * 1000)}`
    setFormData(prev => ({ ...prev, qr_code: qrCode }))
    toast.success('QR Code generated successfully!')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Product name is required")
      return false
    }
    if (!formData.product_category_id) {
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
    if (!formData.unit_id) {
      setError("Unit is required")
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      let result: Product

      if (isEditMode && product) {
        // Edit mode - update product using FormData format
        const formDataToSend = new FormData()
        
        // Map fields according to API requirements
        formDataToSend.append('product_name', formData.name.trim())
        if (formData.generic_name.trim()) {
          formDataToSend.append('generic_name', formData.generic_name.trim())
        }
        
        // Use existing SKU or generate one
        const sku = formData.sku.trim() || (formData.barcode.trim() || `SKU-${Date.now()}`)
        formDataToSend.append('sku', sku)
        
        if (formData.manufacturer.trim()) {
          formDataToSend.append('manufacturer', formData.manufacturer.trim())
        }
        
        if (formData.unit_id) {
          formDataToSend.append('unit_id', formData.unit_id)
        }
        const packSizeNum = Number.parseInt(formData.pack_size || '1', 10)
        const validPackSize = Number.isNaN(packSizeNum) || packSizeNum <= 0 ? 1 : packSizeNum
        formDataToSend.append('unit', validPackSize.toString())
        formDataToSend.append('product_category_id', formData.product_category_id)
        formDataToSend.append('requires_prescription', formData.requires_prescription.toString())
        
        if (formData.description.trim()) {
          formDataToSend.append('description', formData.description.trim())
        }
        if (formData.barcode.trim()) {
          formDataToSend.append('barcode', formData.barcode.trim())
        }
        if (formData.qr_code.trim()) {
          formDataToSend.append('qrcode', formData.qr_code.trim())
        }
        
        formDataToSend.append('unit_price', formData.unit_price)
        formDataToSend.append('selling_price', formData.selling_price)
        formDataToSend.append('pack_size', validPackSize.toString())
        formDataToSend.append('min_stock', formData.min_stock_level || '10')
        formDataToSend.append('max_stock', formData.max_stock_level || '1000')
        
        // Add image file if available (only if new image is selected)
        if (imageFile) {
          formDataToSend.append('image', imageFile)
        }

        const response = await backendApi.put(`/v1/products/update-product/${product.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        result = response.data?.data || response.data
        toast.success("Product updated successfully!")
      } else {
        // Create new product - use FormData format for /v1/products/new-product
        const formDataToSend = new FormData()
        
        // Map fields according to API requirements
        formDataToSend.append('product_name', formData.name.trim())
        if (formData.generic_name.trim()) {
          formDataToSend.append('generic_name', formData.generic_name.trim())
        }
        
        // Generate SKU if not provided
        const sku = formData.sku.trim() || (formData.barcode.trim() || `SKU-${Date.now()}`)
        formDataToSend.append('sku', sku)
        
        if (formData.manufacturer.trim()) {
          formDataToSend.append('manufacturer', formData.manufacturer.trim())
        }
        formDataToSend.append('unit_id', formData.unit_id)
        formDataToSend.append('product_category_id', formData.product_category_id)
        formDataToSend.append('requires_prescription', formData.requires_prescription.toString())
        
        if (formData.description.trim()) {
          formDataToSend.append('description', formData.description.trim())
        }
        if (formData.barcode.trim()) {
          formDataToSend.append('barcode', formData.barcode.trim())
        }
        if (formData.qr_code.trim()) {
          formDataToSend.append('qrcode', formData.qr_code.trim())
        }
        
        formDataToSend.append('unit_price', formData.unit_price)
        formDataToSend.append('selling_price', formData.selling_price)
        const packSizeNum = Number.parseInt(formData.pack_size || '1', 10)
        const validPackSize = Number.isNaN(packSizeNum) || packSizeNum <= 0 ? 1 : packSizeNum
        formDataToSend.append('unit', validPackSize.toString())
        formDataToSend.append('pack_size', validPackSize.toString())
        formDataToSend.append('min_stock', formData.min_stock_level || '10')
        formDataToSend.append('max_stock', formData.max_stock_level || '1000')
        
        // Add image file if available
        if (imageFile) {
          formDataToSend.append('image', imageFile)
        }

        const response = await backendApi.post('/v1/products/new-product', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        result = response.data?.data || response.data
        toast.success("Product created successfully!")
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result)
      }

      onClose()
    } catch (err: unknown) {
      console.error("Error saving product:", err)
      const error = err as { message?: string; response?: { data?: { message?: string } } }
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${isEditMode ? 'update' : 'create'} product`
      setError(errorMessage)
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
      product_category_id: "",
      sku: "",
      unit_id: "",
      unit_price: "",
      selling_price: "",
      pack_size: "1",
      min_stock_level: "10",
      max_stock_level: "1000",
      requires_prescription: false,
    })
    setError("")
    setImageFile(null)
    setImagePreview(null)
    setImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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

                <div className="w-full">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.product_category_id} 
                    onValueChange={(value) => {
                      handleInputChange("product_category_id", value)
                      // Also set category name for display
                      const selectedCat = categories.find(cat => cat.id.toString() === value)
                      if (selectedCat) {
                        handleInputChange("category", selectedCat.category_name)
                      }
                    }}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.category_name.replace(/_/g, " ")}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>
                          {isLoadingCategories ? "Loading categories..." : "No categories available"}
                        </SelectItem>
                      )}
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

            {/* Product Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                Product Image
              </h3>
              <div className="space-y-4">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Area */}
                <div className="space-y-3">
                  <Label htmlFor="image" className="text-sm font-medium">
                    Product Image
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <div className="space-y-2">
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                          >
                            Click to upload
                          </button>
                          <span className="text-gray-500 text-sm"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    </div>
                  </div>
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
                  <div className="relative mt-1.5">
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => handleInputChange("barcode", e.target.value)}
                      placeholder="e.g., 1234567890123"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={generateBarcode}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ScanLine className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="qr_code" className="text-sm font-medium">
                    QR Code
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="qr_code"
                      value={formData.qr_code}
                      onChange={(e) => handleInputChange("qr_code", e.target.value)}
                      placeholder="QR code data"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={generateQRCode}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
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
                  <Label htmlFor="unit_id" className="text-sm font-medium">
                    Unit <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.unit_id}
                    onValueChange={(value) => handleInputChange("unit_id", value)}
                    disabled={isLoadingUnits}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder={isLoadingUnits ? "Loading units..." : "Select unit"} />
                    </SelectTrigger>
                    <SelectContent>
                      {units.length > 0 ? (
                        units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id.toString()}>
                            {unit.unit}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>
                          {isLoadingUnits ? "Loading units..." : "No units available"}
                        </SelectItem>
                      )}
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
