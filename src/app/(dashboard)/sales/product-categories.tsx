"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Scan } from "lucide-react"
import { toast } from "react-toastify"
import { backendApi } from "@/lib/axios-config"

interface ProductCategoriesProps {
  onCategorySelect: (category: string) => void
  onSearchChange: (searchTerm: string) => void
  selectedCategory: string
}

interface Category {
  name: string
  icon: string
  color: string
  value: string
}

export function ProductCategories({ 
  onCategorySelect, 
  onSearchChange, 
  selectedCategory 
}: ProductCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([
    { name: "All", icon: "➕", color: "bg-gray-100 text-gray-700", value: "all" }
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const categoryIcons: { [key: string]: string } = {
    "OTC": "💊",
    "PRESCRIPTION": "🩺",
    "SUPPLEMENTS": "💊",
    "MEDICAL_DEVICES": "🩹",
    "COSMETICS": "✨",
    "OTHER": "📦"
  }

  const categoryColors: { [key: string]: string } = {
    "OTC": "bg-blue-100 text-blue-700",
    "PRESCRIPTION": "bg-red-100 text-red-700",
    "SUPPLEMENTS": "bg-green-100 text-green-700",
    "MEDICAL_DEVICES": "bg-purple-100 text-purple-700",
    "COSMETICS": "bg-pink-100 text-pink-700",
    "OTHER": "bg-gray-100 text-gray-700"
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      // Get all products to extract unique categories
      const response = await backendApi.get('/products?limit=1000')
      const products = response.data?.data || response.data || []
      
      // If no products returned, use fallback categories
      if (!products || products.length === 0) {
        const fallbackCategories: Category[] = [
          { name: "All", icon: "➕", color: "bg-gray-100 text-gray-700", value: "all" },
          { name: "OTC", icon: "💊", color: "bg-blue-100 text-blue-700", value: "OTC" },
          { name: "Prescription", icon: "🩺", color: "bg-red-100 text-red-700", value: "PRESCRIPTION" },
          { name: "Supplements", icon: "💊", color: "bg-green-100 text-green-700", value: "SUPPLEMENTS" }
        ]
        setCategories(fallbackCategories)
      } else {
        const uniqueCategories = [...new Set(products.map((product: any) => product.category).filter(Boolean))] as string[]
        
        const categoryList: Category[] = [
          { name: "All", icon: "➕", color: "bg-gray-100 text-gray-700", value: "all" },
          ...uniqueCategories.map((category: string) => ({
            name: category.charAt(0) + category.slice(1).toLowerCase(),
            icon: categoryIcons[category] || "📦",
            color: categoryColors[category] || "bg-gray-100 text-gray-700",
            value: category
          }))
        ]
        
        setCategories(categoryList)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search products by name, barcode, or category..." 
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

      {/* Category Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading ? (
          // Loading skeleton for categories
          [...Array(6)].map((_, index) => (
            <div key={index} className="h-20 bg-muted rounded-lg animate-pulse"></div>
          ))
        ) : (
          categories.map((category, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex-col space-y-2 ${category.color} border-2 hover:scale-105 transition-transform ${
                selectedCategory === category.value ? 'ring-2 ring-teal-500' : ''
              }`}
              onClick={() => onCategorySelect(category.value)}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </Button>
          ))
        )}
      </div>
    </div>
  )
}
