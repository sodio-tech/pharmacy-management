import { useState, useEffect } from "react"
import { Product } from "@/types/sales"
import { useProductCategories } from "@/hooks/useProductCategories"
import { useProductUnits } from "@/hooks/useProductUnits"
import { backendApi } from "@/lib/axios-config"

export interface ProductFormData {
  name: string
  description: string
  generic_name: string
  manufacturer: string
  barcode: string
  qr_code: string
  category: string
  product_category_id: number[]
  sku: string
  unit_id: string
  unit_price: string
  selling_price: string
  pack_size: string
  stock: string
  branch_id: string
  requires_prescription: boolean
  gst_percent: string
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  generic_name: "",
  manufacturer: "",
  barcode: "",
  qr_code: "",
  category: "OTC",
  product_category_id: [],
  sku: "",
  unit_id: "",
  unit_price: "",
  selling_price: "",
  pack_size: "1",
  stock: "0",
  branch_id: "",
  requires_prescription: false,
  gst_percent: "",
}

interface ApiProductResponse {
  id: number
  product_name: string
  unit: string
  generic_name?: string
  sku: string
  brand_name?: string | null
  description?: string
  pack_size: number
  barcode?: string
  qrcode?: string
  image?: string
  requires_prescription: boolean
  manufacturer?: string
  unit_price: string
  selling_price: string
  is_active: boolean
  stock: number
  gst_rate?: number
  product_categories?: string[]
  additional_images?: string[]
}

export function useProductForm(product?: Product | null, branchId?: string) {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const [productImages, setProductImages] = useState<string[]>([])
  const { categories } = useProductCategories()
  const { units } = useProductUnits()

  // Fetch product details from API when editing
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product?.id) return
      if (categories.length === 0 || units.length === 0) return

      setIsLoadingProduct(true)
      try {
        const params = new URLSearchParams()
        params.append('product_id', product.id.toString())
        if (branchId) {
          params.append('branch_id', branchId)
        }
        const response = await backendApi.get(`/v1/products/details?${params.toString()}`)
        const apiProduct: ApiProductResponse = response.data?.data?.products?.[0]
        
        if (!apiProduct) {
          setIsLoadingProduct(false)
          return
        }

        // Map product_categories (array of names) to category IDs
        let categoryIds: number[] = []
        if (apiProduct.product_categories && Array.isArray(apiProduct.product_categories)) {
          categoryIds = apiProduct.product_categories
            .map((catName: string) => {
              const matchingCategory = categories.find(
                cat => cat.category_name.toLowerCase().replace(/_/g, " ") === catName.toLowerCase()
              )
              return matchingCategory?.id
            })
            .filter((id): id is number => id !== undefined)
        }

        // Find matching unit ID from unit name
        const matchingUnit = units.find(
          unit => unit.unit.toLowerCase() === apiProduct.unit?.toLowerCase()
        )

        setFormData({
          name: apiProduct.product_name || "",
          description: apiProduct.description || "",
          generic_name: apiProduct.generic_name || "",
          manufacturer: apiProduct.manufacturer || "",
          barcode: apiProduct.barcode || "",
          qr_code: apiProduct.qrcode || "",
          category: apiProduct.product_categories?.[0] || "",
          product_category_id: categoryIds,
          sku: apiProduct.sku || "",
          unit_id: matchingUnit?.id.toString() || "",
          unit_price: apiProduct.unit_price || "",
          selling_price: apiProduct.selling_price || "",
          pack_size: apiProduct.pack_size?.toString() || "1",
          stock: apiProduct.stock?.toString() || "0",
          branch_id: (apiProduct as any).branch_id?.toString() || "",
          requires_prescription: apiProduct.requires_prescription || false,
          gst_percent: apiProduct.gst_rate?.toString() || "",
        })

        // Extract and set product images
        const images: string[] = []
        if (apiProduct.image) {
          images.push(apiProduct.image)
        }
        if (apiProduct.additional_images && Array.isArray(apiProduct.additional_images)) {
          images.push(...apiProduct.additional_images.filter((img: any): img is string => typeof img === 'string' && !!img))
        }
        setProductImages(images)
      } catch (error) {
        console.error("Error fetching product details:", error)
      } finally {
        setIsLoadingProduct(false)
      }
    }

    if (product?.id) {
      fetchProductDetails()
    } else {
      // Reset form if no product
      setFormData(initialFormData)
      setProductImages([])
    }
  }, [product?.id, categories, units, branchId])

  // Legacy support: populate form from product prop (for backward compatibility)
  useEffect(() => {
    if (product && !product.id && categories.length > 0 && units.length > 0) {
      // Find matching category IDs from API categories
      let categoryIds: number[] = []
      if (product.category) {
        const matchingCategory = categories.find(
          cat => cat.category_name.toLowerCase().replace(/_/g, "-") === product.category?.toLowerCase().replace(/_/g, "-")
        )
        if (matchingCategory) {
          categoryIds = [matchingCategory.id]
        }
      }
      
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
        product_category_id: categoryIds,
        sku: "",
        unit_id: matchingUnit?.id.toString() || "",
        unit_price: product.unit_price?.toString() || "",
        selling_price: product.selling_price?.toString() || "",
        pack_size: product.pack_size?.toString() || "1",
        stock: product.stock?.toString() || "0",
        branch_id: (product as any).branch_id?.toString() || "",
        requires_prescription: product.requires_prescription || false,
        gst_percent: (product as any).gst_rate?.toString() || "",
      })
    } 
  }, [product, categories, units])

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData(initialFormData)
  }

  return {
    formData,
    setFormData,
    handleInputChange,
    resetForm,
    isLoadingProduct,
    productImages
  }
}

