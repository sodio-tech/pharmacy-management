"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, Package, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { Product } from "@/types/sales"
import { backendApi } from "@/lib/axios-config"

interface AddBatchModalProps {
  productId: string
  onClose: () => void
  onSuccess: () => void
}

interface BatchFormData {
  batchNumber: string
  productId: string
  supplierId: string
  mfgDate: string
  expiryDate: string
  quantity: number
  costPrice: number
  sellingPrice: number
}

interface Supplier {
  id: string
  name: string
}

interface CreateBatchRequest {
  product_id: string
  batch_number: string
  manufacturing_date: string
  expiry_date: string
  initial_quantity: number
  cost_price: number
  supplier_id: string
  notes?: string
}

export function AddBatchModal({ productId, onClose, onSuccess }: AddBatchModalProps) {
  const [formData, setFormData] = useState<BatchFormData>({
    batchNumber: "BAT251006SEW9",
    productId,
    supplierId: "",
    mfgDate: "",
    expiryDate: "",
    quantity: 100,
    costPrice: 10,
    sellingPrice: 20,
  })

  const [product, setProduct] = useState<Product | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchProductAndSuppliers()
  }, [productId])

  const fetchProductAndSuppliers = async () => {
    setLoadingData(true)
    try {
      // Fetch product data
      const productResponse = await backendApi.get(`/products/${productId}`)
      const product = productResponse.data?.data || productResponse.data
      setProduct(product)
      setFormData((prev) => ({
        ...prev,
        sellingPrice: product.selling_price || product.unit_price,
      }))

      // Fetch suppliers
      const suppliersResponse = await backendApi.get('/suppliers')
      const suppliers = suppliersResponse.data?.data || suppliersResponse.data || []
      setSuppliers(suppliers)
      

      if (suppliers.length > 0) {
        setFormData((prev) => ({
          ...prev,
          supplierId: suppliers[0].id,
        }))
      } else {
        toast.warning("No suppliers found. Please add suppliers first before creating batches.")
      }
    } catch (error: unknown) {
      console.error("Error loading data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.batchNumber.trim()) newErrors.batchNumber = "Batch number is required"
    if (!formData.supplierId) newErrors.supplierId = "Supplier is required"
    if (!formData.mfgDate) newErrors.mfgDate = "Manufacturing date is required"
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0"
    if (formData.costPrice <= 0) newErrors.costPrice = "Cost price must be greater than 0"
    if (formData.sellingPrice <= 0) newErrors.sellingPrice = "Selling price must be greater than 0"

    // Validate dates
    if (formData.mfgDate && formData.expiryDate) {
      const mfgDate = new Date(formData.mfgDate)
      const expiryDate = new Date(formData.expiryDate)
      const today = new Date()

      if (mfgDate > today) {
        newErrors.mfgDate = "Manufacturing date cannot be in the future"
      }

      if (expiryDate <= mfgDate) {
        newErrors.expiryDate = "Expiry date must be after manufacturing date"
      }

      if (expiryDate <= today) {
        newErrors.expiryDate = "Expiry date must be in the future"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the form errors")
      return
    }

    setLoading(true)

    try {
      // Transform form data to match backend API
      const batchData: CreateBatchRequest = {
        product_id: formData.productId,
        batch_number: formData.batchNumber,
        manufacturing_date: formData.mfgDate,
        expiry_date: formData.expiryDate,
        initial_quantity: formData.quantity,
        cost_price: formData.costPrice,
        supplier_id: formData.supplierId,
        notes: `Selling price: ₹${formData.sellingPrice}`,
      }

      await backendApi.post('/batches', batchData)
      toast.success("Batch created successfully")
      onSuccess()
    } catch (error: unknown) {
      console.error("Error creating batch:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof BatchFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const generateBatchNumber = () => {
    const now = new Date()
    const year = now.getFullYear().toString().slice(2)
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const day = now.getDate().toString().padStart(2, "0")
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    const batchNumber = `BAT${year}${month}${day}${random}`
    handleInputChange("batchNumber", batchNumber)
  }

  const getDaysToExpiry = (): number | null => {
    if (!formData.expiryDate) return null
    const today = new Date()
    const expiry = new Date(formData.expiryDate)
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getExpiryStatus = () => {
    const days = getDaysToExpiry()
    if (days === null) return null

    if (days <= 0) {
      return { color: "text-red-600", message: "This batch is expired!" }
    } else if (days <= 30) {
      return { color: "text-orange-600", message: `Expires in ${days} days` }
    } else if (days <= 90) {
      return { color: "text-yellow-600", message: `Expires in ${days} days` }
    } else {
      return { color: "text-green-600", message: `Expires in ${days} days` }
    }
  }

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="add-batch-modal-title">
                  Add New Batch
                </h2>
                 {product && (
                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      for {product.name} (ID: {String(product.id).slice(0, 8)})
                   </p>
                 )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
              data-testid="close-modal-btn"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-teal-600 rounded-full"></span>
                    Batch Identification
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="batchNumber" className="text-sm font-medium">
                        Batch Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input
                          id="batchNumber"
                          value={formData.batchNumber}
                          onChange={(e) => handleInputChange("batchNumber", e.target.value)}
                          placeholder="Enter batch number"
                          className={errors.batchNumber ? "border-red-500" : ""}
                          data-testid="batch-number-input"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateBatchNumber}
                          data-testid="generate-batch-btn"
                        >
                          Generate
                        </Button>
                      </div>
                      {errors.batchNumber && <p className="text-red-500 text-sm mt-1">{errors.batchNumber}</p>}
                    </div>

                    <div className="w-full">
                      <Label htmlFor="supplier" className="text-sm font-medium">
                        Supplier <span className="text-red-500">*</span>
                      </Label>
                      <Select

                        value={formData.supplierId}
                        onValueChange={(value) => handleInputChange("supplierId", value)}
                      >
                        <SelectTrigger

                          className={`mt-1.5 w-full ${errors.supplierId ? "border-red-500" : ""}`}
                          data-testid="supplier-select"
                        >
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.supplierId && <p className="text-red-500 text-sm mt-1">{errors.supplierId}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-cyan-600 rounded-full"></span>
                    Dates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mfgDate" className="text-sm font-medium">
                        Manufacturing Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="mfgDate"
                        type="date"
                        value={formData.mfgDate}
                        onChange={(e) => handleInputChange("mfgDate", e.target.value)}
                        className={`mt-1.5 ${errors.mfgDate ? "border-red-500" : ""}`}
                        data-testid="mfg-date-input"
                      />
                      {errors.mfgDate && <p className="text-red-500 text-sm mt-1">{errors.mfgDate}</p>}
                    </div>

                    <div>
                      <Label htmlFor="expiryDate" className="text-sm font-medium">
                        Expiry Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        className={`mt-1.5 ${errors.expiryDate ? "border-red-500" : ""}`}
                        data-testid="expiry-date-input"
                      />
                      {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}

                      {formData.expiryDate &&
                        (() => {
                          const status = getExpiryStatus()
                          return (
                            status && (
                              <div className={`flex items-center gap-2 mt-2 text-sm ${status.color}`}>
                                <AlertTriangle className="h-4 w-4" />
                                <span>{status.message}</span>
                              </div>
                            )
                          )
                        })()}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
                    Quantity & Pricing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                       <Label htmlFor="quantity" className="text-sm font-medium">
                         Quantity <span className="text-red-500">*</span> {product && `(${product.unit_of_measure})`}
                       </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", Number(e.target.value) || 0)}
                        placeholder="0"
                        className={`mt-1.5 ${errors.quantity ? "border-red-500" : ""}`}
                        data-testid="quantity-input"
                      />
                      {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                    </div>

                    <div>
                      <Label htmlFor="costPrice" className="text-sm font-medium">
                        Cost Price per Unit <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="costPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.costPrice}
                        onChange={(e) => handleInputChange("costPrice", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className={`mt-1.5 ${errors.costPrice ? "border-red-500" : ""}`}
                        data-testid="cost-price-input"
                      />
                      {errors.costPrice && <p className="text-red-500 text-sm mt-1">{errors.costPrice}</p>}
                    </div>

                    <div>
                      <Label htmlFor="sellingPrice" className="text-sm font-medium">
                        Selling Price per Unit <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="sellingPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.sellingPrice}
                        onChange={(e) => handleInputChange("sellingPrice", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className={`mt-1.5 ${errors.sellingPrice ? "border-red-500" : ""}`}
                        data-testid="selling-price-input"
                      />
                      {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>}
                    </div>
                  </div>

                  {formData.quantity > 0 && formData.costPrice > 0 && (
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-3">Batch Summary</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">Total Cost</p>
                          <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mt-1">
                            ₹{(formData.quantity * formData.costPrice).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">Total Value</p>
                          <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mt-1">
                            ₹{(formData.quantity * formData.sellingPrice).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">Profit Margin</p>
                          <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mt-1">
                            {formData.sellingPrice > 0
                              ? (((formData.sellingPrice - formData.costPrice) / formData.costPrice) * 100).toFixed(1)
                              : 0}
                            %
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">Total Profit</p>
                          <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mt-1">
                            ₹{(formData.quantity * (formData.sellingPrice - formData.costPrice)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="text-red-500">*</span> Required fields
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={loading} data-testid="cancel-btn">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white"
                data-testid="save-batch-btn"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Add Batch
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
