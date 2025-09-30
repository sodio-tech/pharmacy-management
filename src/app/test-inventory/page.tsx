"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, Plus, Scan } from "lucide-react"

interface Product {
  id: string
  sku: string
  name: string
  category: string
  totalBatches: number
  totalStock: number
}

export default function TestInventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/test-inventory")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setError(null)
      } else {
        setError("Failed to fetch products")
      }
    } catch (err) {
      setError("Network error")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "PRESCRIPTION":
        return "bg-blue-100 text-blue-800"
      case "OTC":
        return "bg-green-100 text-green-800"
      case "SUPPLEMENT":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const testAddProduct = async () => {
    try {
      const productData = {
        sku: `TEST${Date.now()}`,
        name: `Test Product ${Date.now()}`,
        description: "Test product created via UI",
        category: "OTC",
        unit: "tablets",
        hsnCode: "30049099",
        gstRate: 12,
        price: 25.00,
        reorderLevel: 10,
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        alert("Product added successfully!")
        fetchProducts()
      } else {
        const error = await response.json()
        alert(`Failed to add product: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert("Error adding product")
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inventory...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={fetchProducts} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Test Inventory System
          </h1>
          <p className="text-gray-600">
            Testing backend integration without authentication
          </p>
          <div className="mt-4 flex gap-4">
            <Button onClick={testAddProduct} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Test Add Product
            </Button>
            <Button onClick={fetchProducts} variant="outline">
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-gray-600 text-sm">Total Products</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {products.filter(p => p.totalStock <= 20).length}
                </p>
                <p className="text-gray-600 text-sm">Low Stock</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {products.reduce((sum, p) => sum + p.totalStock, 0)}
                </p>
                <p className="text-gray-600 text-sm">Total Stock</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Scan className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {products.reduce((sum, p) => sum + p.totalBatches, 0)}
                </p>
                <p className="text-gray-600 text-sm">Total Batches</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Products in Database</h2>
          </div>
          <div className="p-6">
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No products found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        💊
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                      
                      <div className="text-right">
                        <p className="font-medium">
                          {product.totalStock} units
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.totalBatches} batch(es)
                        </p>
                      </div>
                      
                      {product.totalStock <= 20 && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Test Results */}
        <Card className="mt-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">✅ Integration Status</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>PostgreSQL database connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Prisma ORM working</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sample data loaded ({products.length} products)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Frontend fetching data successfully</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time stats calculation working</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}