"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Save, Package } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "react-toastify"
import { Product } from "@/types/sales"
import { backendApi } from "@/lib/axios-config"
import { useProductForm } from "./hooks/useProductForm"
import { BasicInformationSection } from "./components/BasicInformationSection"
import { CategoryMultiSelect } from "./components/CategoryMultiSelect"
import { ImageUploadSection } from "./components/ImageUploadSection"
import { IdentificationSection } from "./components/IdentificationSection"
import { PricingSection } from "./components/PricingSection"
import { PackagingStockSection } from "./components/PackagingStockSection"
import { useUser } from "@/contexts/UserContext"
import { useAppSelector } from "@/store/hooks"
import { useBranchSync } from "@/hooks/useBranchSync"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
  branchId?: string | number | null
  onSuccess?: (product: Product) => void
}

export function AddProductModal({ isOpen, onClose, product, branchId, onSuccess }: AddProductModalProps) {
  const mode = product?.id ? "edit" : "add"
  const { user } = useUser()
  const branches = useAppSelector((state) => state.branch.branches)
  const isLoadingBranches = useAppSelector((state) => state.branch.isLoading)
  
  // Sync branches to Redux
  useBranchSync(user?.pharmacy_id)

  const branchIdToUse = branchId
    ? branchId.toString()
    : (product?.branch_id?.toString() || undefined)

  const { formData, handleInputChange, resetForm, isLoadingProduct, productImages } = useProductForm(
    mode === "edit" ? product : null,
    branchIdToUse
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<Array<{ file: File; preview: string }>>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (branchIdToUse && mode === "edit" && !formData.branch_id) {
      handleInputChange("branch_id", branchIdToUse)
    }
  }, [branchIdToUse, mode, formData.branch_id, handleInputChange])

  useEffect(() => {
    if (mode === "edit" && productImages.length > 0) {
      setImageUrls(productImages)
    } else if (mode === "add") {
      setImageUrls([])
    }
  }, [productImages, mode])

  useEffect(() => {
    if (mode === "add" && !isLoadingBranches && branches.length > 0 && !formData.branch_id) {
      handleInputChange("branch_id", branches[0].id.toString())
    }
  }, [mode, isLoadingBranches, branches, formData.branch_id, handleInputChange])

  const processFiles = (files: File[]) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const errors: string[] = []

    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        errors.push(`"${file.name}" is not a valid image file`)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`"${file.name}" size must be less than 10MB`)
        return
      }
      validFiles.push(file)
    })

    if (errors.length > 0) {
      setError(errors.join(', '))
      if (validFiles.length === 0) return
    } else {
      setError("")
    }

    const previewPromises = validFiles.map((file) => {
      return new Promise<{ file: File; preview: string }>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            file,
            preview: e.target?.result as string
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(previewPromises).then((previews) => {
      setImageFiles(prev => [...prev, ...validFiles])
      setImagePreviews(prev => [...prev, ...previews])
    })
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    processFiles(Array.from(files))
  }

  const handleFilesDrop = (files: File[]) => {
    processFiles(files)
  }

  const handleRemoveImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const generateBarcode = () => {
    const barcode = Math.floor(1000000000000 + Math.random() * 9000000000000).toString()
    handleInputChange("barcode", barcode)
    toast.success('Barcode generated successfully!')
  }

  const generateQRCode = () => {
    const qrCode = `QR${Date.now()}${Math.floor(Math.random() * 1000)}`
    handleInputChange("qr_code", qrCode)
    toast.success('QR Code generated successfully!')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Product name is required")
      toast.error("Product name is required")
      return false
    }
    if (!formData.branch_id.trim()) {
      setError("Branch selection is required")
      toast.error("Branch selection is required")
      return false
    }
    if (!formData.unit_price.trim() || Number.parseFloat(formData.unit_price) <= 0) {
      setError("Unit price is required and must be greater than 0")
      toast.error("Unit price is required and must be greater than 0")
      return false
    }
    if (!formData.selling_price.trim() || Number.parseFloat(formData.selling_price) <= 0) {
      setError("Selling price is required and must be greater than 0")
      toast.error("Selling price is required and must be greater than 0")
      return false
    }
    if (!formData.gst_percent.trim() || Number.parseFloat(formData.gst_percent) < 0 || Number.parseFloat(formData.gst_percent) > 100) {
      setError("GST percentage is required and must be between 0 and 100")
      toast.error("GST percentage is required and must be between 0 and 100")
      return false
    }
    return true
  }

  const buildFormData = () => {
    const formDataToSend = new FormData()

    formDataToSend.append('product_name', formData.name.trim())
    if (formData.generic_name.trim()) {
      formDataToSend.append('generic_name', formData.generic_name.trim())
    }

    const sku = formData.sku.trim() || (formData.barcode.trim() || `SKU-${Date.now()}`)
    formDataToSend.append('sku', sku)

    if (formData.manufacturer.trim()) {
      formDataToSend.append('manufacturer', formData.manufacturer.trim())
    }

    if (formData.unit_id) {
      formDataToSend.append('unit', formData.unit_id)

    }

    const packSizeNum = Number.parseInt(formData.pack_size || '1', 10)
    const validPackSize = Number.isNaN(packSizeNum) || packSizeNum <= 0 ? 1 : packSizeNum
    formDataToSend.append('product_category_id', JSON.stringify(formData.product_category_id))
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
    formDataToSend.append('gst_rate', formData.gst_percent || '0')
    formDataToSend.append('pack_size', validPackSize.toString())
    formDataToSend.append('stock', formData.stock || '0')
    if (formData.branch_id) {
      formDataToSend.append('branch_id', formData.branch_id.toString())
    }

    imageFiles.forEach((file) => {
      formDataToSend.append('image', file)
    })

    return formDataToSend
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      const formDataToSend = buildFormData()
      let result: Product

      if (mode === "edit" && product?.id) {
        const response = await backendApi.put(`/v1/products/update-product/${product.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        result = response.data?.data || response.data
        toast.success("Product updated successfully!")
      } else {
        const response = await backendApi.post('/v1/products/new-product', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        result = response.data?.data || response.data
        toast.success("Product created successfully!")
      }

      if (onSuccess) {
        onSuccess(result)
      }

      onClose()
    } catch (err: unknown) {
      console.error("Error saving product:", err)
      const error = err as { message?: string; response?: { data?: { message?: string } } }
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${mode === "edit" ? 'update' : 'create'} product`
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    setError("")
    setImageFiles([])
    setImagePreviews([])
    setImageUrls([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mode === "edit" ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {mode === "edit" ? 'Update the product details below' : 'Fill in the product details below'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {isLoadingProduct && (
              <div className="mb-6 flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mode === "edit" ? "Loading product details..." : "Loading..."}
                  </p>
                </div>
              </div>
            )}

            {!isLoadingProduct && (
              <div className="space-y-6">
                <BasicInformationSection
                  formData={{
                    name: formData.name,
                    generic_name: formData.generic_name,
                    manufacturer: formData.manufacturer,
                    description: formData.description,
                    requires_prescription: formData.requires_prescription
                  }}
                  onInputChange={(field, value) => handleInputChange(field as keyof typeof formData, value)}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                    Branch Selection
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="branch_id" className="text-sm font-medium">
                        Branch <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.branch_id}
                        onValueChange={(value) => {
                          handleInputChange("branch_id", value)
                        }}
                        disabled={isLoadingBranches || mode === "edit"}
                      >
                        <SelectTrigger className="mt-1.5 w-full">
                          <SelectValue placeholder={isLoadingBranches ? "Loading branches..." : "Select branch"} />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.length > 0 ? (
                            branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id.toString()}>
                                {branch.branch_name}
                                {branch.branch_location && ` - ${branch.branch_location}`}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-branches" disabled>
                              {isLoadingBranches ? "Loading branches..." : "No branches available"}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {mode === "edit" && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Note: Branch cannot be edited for existing products
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CategoryMultiSelect
                      selectedCategoryIds={formData.product_category_id}
                      onCategoryChange={(ids) => handleInputChange("product_category_id", ids)}
                    />
                  </div>
                </div>

                <ImageUploadSection
                  imagePreviews={imagePreviews}
                  imageUrls={imageUrls}
                  onImageChange={handleImageChange}
                  onFilesDrop={handleFilesDrop}
                  onRemoveImage={handleRemoveImage}
                  onRemoveExistingImage={handleRemoveExistingImage}
                  isLoading={isLoading}
                />

                <IdentificationSection
                  barcode={formData.barcode}
                  qrCode={formData.qr_code}
                  onBarcodeChange={(value) => handleInputChange("barcode", value)}
                  onQRCodeChange={(value) => handleInputChange("qr_code", value)}
                  onGenerateBarcode={generateBarcode}
                  onGenerateQRCode={generateQRCode}
                />

                <PricingSection
                  unitPrice={formData.unit_price}
                  sellingPrice={formData.selling_price}
                  gstPercent={formData.gst_percent}
                  onUnitPriceChange={(value) => handleInputChange("unit_price", value)}
                  onSellingPriceChange={(value) => handleInputChange("selling_price", value)}
                  onGstPercentChange={(value) => handleInputChange("gst_percent", value)}
                />

                <PackagingStockSection
                  unitId={formData.unit_id}
                  packSize={formData.pack_size}
                  stock={formData.stock}
                  onUnitIdChange={(value) => handleInputChange("unit_id", value)}
                  onPackSizeChange={(value) => handleInputChange("pack_size", value)}
                  onStockChange={(value) => handleInputChange("stock", value)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
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
                    {mode === "edit" ? 'Update Product' : 'Save Product'}
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
