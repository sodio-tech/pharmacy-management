"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Scan, Plus } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"
import { backendApi } from "@/lib/axios-config"
import { useCart } from "@/contexts/CartContext"

interface ProductCategoriesProps {
  onCategorySelect: (category: string) => void
  onSearchChange: (searchTerm: string) => void
  selectedCategory: string
  selectedBranchId: number | string | null
  onProductsLoad?: (products: any[]) => void
}

interface BranchStockProduct {
  product_id: number
  product_name: string
  generic_name: string
  image: string
  unit_price: string
  gst_rate: number
  pack_size: number
  available_stock: number
  min_stock: number
  max_stock: number
}

export function ProductCategories({ 
  onCategorySelect, 
  onSearchChange, 
  selectedCategory,
  selectedBranchId,
  onProductsLoad
}: ProductCategoriesProps) {
  const { addToCart } = useCart()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<BranchStockProduct[]>([])

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products
    }
    const query = searchTerm.toLowerCase()
    return products.filter(
      (product) =>
        product.product_name?.toLowerCase().includes(query) ||
        product.generic_name?.toLowerCase().includes(query)
    )
  }, [products, searchTerm])

  const fetchBranchStock = useCallback(async (branchId: number | string | null) => {
    if (!branchId) return

    try {
      setLoading(true)
      const response = await backendApi.get(`/v1/inventory/branch-stock/${branchId.toString()}`)
      const data = response.data?.data

      if (data?.branch_stock) {
        setProducts(data.branch_stock)
        if (onProductsLoad) {
          onProductsLoad(data.branch_stock)
        }
      } else {
        setProducts([])
      }
    } catch (error: unknown) {
      console.error('Error fetching branch stock:', error)
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [onProductsLoad])

  useEffect(() => {
    if (selectedBranchId) {
      fetchBranchStock(selectedBranchId)
    }
  }, [selectedBranchId, fetchBranchStock])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  const handleAddToCart = (product: BranchStockProduct) => {
    // Map BranchStockProduct to Product type for cart
    const cartProduct = {
      id: product.product_id.toString(),
      name: product.product_name,
      generic_name: product.generic_name,
      selling_price: parseFloat(product.unit_price),
      unit_price: parseFloat(product.unit_price),
      unit_of_measure: "unit",
      image_url: product.image,
      pack_size: product.pack_size,
      is_active: product.available_stock > 0,
      requires_prescription: false,
    }
    addToCart(cartProduct, 1)
    // Toast message is now handled in CartContext - only shows for new items
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search products by name..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Scan className="h-4 w-4 mr-2" />
          Scan
        </Button>
      </div>

      {/* Products Grid */}
        {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="aspect-square bg-muted"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">
            {searchTerm ? "No products found matching your search" : "No products available in this branch"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.product_id}
              className="group relative overflow-hidden py-0 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image || "/assets/fallback.jpg"}
                  alt={product.product_name}
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/assets/fallback.jpg"
                  }}
                />
                {product.available_stock > 0 && (
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
                {product.available_stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">Out of Stock</span>
                  </div>
        )}
      </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 min-h-[2.5rem]">{product.product_name}</h3>
                {product.generic_name && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.generic_name}</p>
                )}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-lg font-bold text-teal-600">₹{parseFloat(product.unit_price).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Stock: {product.available_stock}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-teal-600 hover:bg-teal-700 h-8 w-8 p-0 rounded-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.available_stock === 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.pack_size > 1 && (
                  <p className="text-xs text-muted-foreground">Pack: {product.pack_size}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
