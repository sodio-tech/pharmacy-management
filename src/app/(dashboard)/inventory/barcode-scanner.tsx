"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Scan, Camera, Search, Package, CircleAlert as AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onProductFound: (product: any) => void
  onProductNotFound: (barcode: string) => void
}

export function BarcodeScanner({ isOpen, onClose, onProductFound, onProductNotFound }: BarcodeScannerProps) {
  const [scannedCode, setScannedCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Mock product database for demonstration
  const mockProducts = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      barcode: "1234567890123",
      brand: "Crocin",
      category: "OTC Medicines",
      stock: 150,
      price: 25.50,
      expiry: "2025-12-31",
      batch: "PCM001",
      location: "A1-B2"
    },
    {
      id: "2", 
      name: "Amoxicillin 250mg",
      barcode: "2345678901234",
      brand: "Novamox",
      category: "Prescription Medicines",
      stock: 75,
      price: 85.00,
      expiry: "2025-08-15",
      batch: "AMX002",
      location: "B2-C3"
    },
    {
      id: "3",
      name: "Vitamin D3 1000 IU",
      barcode: "3456789012345", 
      brand: "HealthVit",
      category: "Supplements & Vitamins",
      stock: 200,
      price: 180.00,
      expiry: "2026-03-20",
      batch: "VD3003",
      location: "C1-A1"
    }
  ]

  const startCamera = async () => {
    try {
      setIsScanning(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error: any) {
      setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const searchProduct = async (code: string) => {
    setIsLoading(true)
    
    try {
      // First try barcode API
      const barcodeResponse = await fetch(`/api/products/barcode?barcode=${encodeURIComponent(code)}`)
      
      if (barcodeResponse.ok) {
        const data = await barcodeResponse.json()
        setSearchResults([data.product])
        onProductFound(data.product)
        setIsLoading(false)
        return
      }

      // If not found by barcode, try general search
      const searchResponse = await fetch(`/api/products/search?q=${encodeURIComponent(code)}&limit=10`)
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        setSearchResults(searchData.products || [])
        
        if (searchData.products && searchData.products.length === 1) {
          onProductFound(searchData.products[0])
        } else if (!searchData.products || searchData.products.length === 0) {
          onProductNotFound(code)
        }
      } else {
        // Fallback to mock data if API fails
        const results = mockProducts.filter(product => 
          product.barcode.includes(code) || 
          product.name.toLowerCase().includes(code.toLowerCase()) ||
          product.brand.toLowerCase().includes(code.toLowerCase())
        )
        
        setSearchResults(results)
        
        if (results.length === 1) {
          onProductFound(results[0])
        } else if (results.length === 0) {
          onProductNotFound(code)
        }
      }
    } catch (error: any) {
      // Use mock data as fallback
      const results = mockProducts.filter(product => 
        product.barcode.includes(code) || 
        product.name.toLowerCase().includes(code.toLowerCase()) ||
        product.brand.toLowerCase().includes(code.toLowerCase())
      )
      
      setSearchResults(results)
      
      if (results.length === 1) {
        onProductFound(results[0])
      } else if (results.length === 0) {
        onProductNotFound(code)
      }
    }
    
    setIsLoading(false)
  }

  const handleManualEntry = () => {
    if (scannedCode.trim()) {
      searchProduct(scannedCode.trim())
    }
  }

  const handleProductSelect = (product: any) => {
    onProductFound(product)
    onClose()
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

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
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Scan className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Barcode Scanner</h2>
                <p className="text-gray-600 text-sm">Scan or enter product barcode</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Manual Entry */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode or product name"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualEntry()}
                  className="flex-1"
                />
                <Button onClick={handleManualEntry} disabled={isLoading}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Camera Scanner */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Camera Scanner</h3>
                {!isScanning ? (
                  <Button onClick={startCamera} variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="outline">
                    Stop Camera
                  </Button>
                )}
              </div>

              {isScanning && (
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-32 border-2 border-teal-400 rounded-lg">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-teal-400"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-teal-400"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-teal-400"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-teal-400"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    Position barcode within the frame
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-3 text-gray-600">Searching products...</span>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && !isLoading && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Search Results ({searchResults.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleProductSelect(product)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
                              <p className="text-xs text-gray-500">Barcode: {product.barcode}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">₹{product.price}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant={product.stock > 50 ? "secondary" : product.stock > 10 ? "outline" : "destructive"}
                                className="text-xs"
                              >
                                {product.stock} in stock
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{product.location}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.length === 0 && scannedCode && !isLoading && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 text-sm mb-4">
                  No products match "{scannedCode}". Would you like to add a new product?
                </p>
                <Button 
                  onClick={() => onProductNotFound(scannedCode)}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Add New Product
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}