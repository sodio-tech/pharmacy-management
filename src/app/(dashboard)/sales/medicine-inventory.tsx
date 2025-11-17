"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"
import { backendApi } from "@/lib/axios-config"
import { Product } from "@/types/sales"

interface MedicineInventoryProps {
  selectedCategory?: string
  searchTerm?: string
  onAddToCart: (product: Product, quantity?: number) => void
}

export function MedicineInventory({ 
  selectedCategory = "all", 
  searchTerm = "",
  onAddToCart 
}: MedicineInventoryProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [lastTap, setLastTap] = useState<number>(0)

  // const fetchProducts = async () => {
  //   try {
  //     setLoading(true)
  //     const filters = {
  //       category: selectedCategory === "all" ? undefined : selectedCategory,
  //       search: searchTerm || undefined,
  //       limit: 50 // Get more products for sales
  //     }
      
  //     const params = new URLSearchParams()
  //     if (filters.category) params.append('category', filters.category)
  //     if (filters.search) params.append('search', filters.search)
  //     if (filters.limit) params.append('limit', filters.limit.toString())
      
  //     const response = await backendApi.get(`/products?${params.toString()}`)
  //     const products = response.data?.data || response.data || []
      
  //     // If no products returned, use fallback data for testing
  //     if (!products || products.length === 0) {
  //       const fallbackProducts = [
  //         {
  //           id: "1",
  //           name: "Paracetamol 500mg",
  //           generic_name: "Paracetamol",
  //           description: "Pain reliever and fever reducer",
  //           category: "OTC",
  //           manufacturer: "GSK",
  //           barcode: "1234567890123",
  //           qr_code: "1234567890123",
  //           unit_price: 3.25,
  //           selling_price: 5.50,
  //           unit_of_measure: "tablets",
  //           pack_size: 1,
  //           min_stock_level: 20,
  //           max_stock_level: 1000,
  //           requires_prescription: false,
  //           is_active: true,
  //           created_at: new Date().toISOString(),
  //           updated_at: new Date().toISOString()
  //         },
  //         {
  //           id: "2",
  //           name: "Ibuprofen 400mg",
  //           generic_name: "Ibuprofen",
  //           description: "Anti-inflammatory pain reliever",
  //           category: "OTC",
  //           manufacturer: "Johnson & Johnson",
  //           barcode: "9876543210987",
  //           qr_code: "9876543210987",
  //           unit_price: 8.50,
  //           selling_price: 12.75,
  //           unit_of_measure: "tablets",
  //           pack_size: 1,
  //           min_stock_level: 15,
  //           max_stock_level: 800,
  //           requires_prescription: false,
  //           is_active: true,
  //           created_at: new Date().toISOString(),
  //           updated_at: new Date().toISOString()
  //         }
  //       ]
  //       setProducts(fallbackProducts)
  //     } else {
  //       setProducts(products)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching products:', error)
  //     toast.error('Failed to fetch products')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   fetchProducts()
  // }, [selectedCategory, searchTerm])

  const handleDoubleTap = (product: Product) => {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      onAddToCart(product, 1)
      toast.success(`${product.name} added to cart`)
    }
    
    setLastTap(now)
  }

  const handleAddToCart = (product: Product) => {
    onAddToCart(product, 1)
    // Toast message is now handled in CartContext - only shows for new items
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-full">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="aspect-square bg-muted"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-full">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group relative overflow-hidden py-0 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => handleDoubleTap(product)}
        >
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {product.is_active && (
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-teal-600">₹{Number(product.selling_price || 0).toFixed(2)}</p>
                {product.unit_price && product.unit_price !== product.selling_price && (
                  <p className="text-xs text-muted-foreground line-through">₹{Number(product.unit_price || 0).toFixed(2)}</p>
                )}
              </div>
              <Button 
                size="sm" 
                className="bg-teal-600 hover:bg-teal-700 h-8 w-8 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToCart(product)
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {product.requires_prescription && (
              <div className="mt-2">
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  Prescription Required
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
