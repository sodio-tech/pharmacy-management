"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Scan, Camera, Search, Package, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

interface BarcodeScannerProps {
  onClose: () => void;
  onSuccess: (product: any) => void;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  totalStock: number;
  isLowStock: boolean;
  availableBatches: number;
  batches: Array<{
    id: string;
    batchNumber: string;
    quantity: number;
    expiryDate: string;
  }>;
}

export function BarcodeScanner({ onClose, onSuccess }: BarcodeScannerProps) {
  const [scannedCode, setScannedCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const searchProduct = async (code: string) => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/products/barcode?barcode=${encodeURIComponent(code.trim())}`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults([data.product]);
        
        // If only one result, automatically select it
        if (data.product) {
          onSuccess(data.product);
          return;
        }
      } else if (response.status === 404) {
        // Try searching by name or SKU
        const searchResponse = await fetch(`/api/products/search?q=${encodeURIComponent(code.trim())}&limit=10`);
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          setSearchResults(searchData.products);
          
          if (searchData.products.length === 0) {
            setError(`No products found for "${code}"`);
          }
        } else {
          setError("Error searching for products");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error searching for products");
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setError("Network error while searching");
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError("Unable to access camera. Please check permissions.");
      setIsScanning(false);
      toast.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualEntry = () => {
    if (scannedCode.trim()) {
      searchProduct(scannedCode.trim());
    }
  };

  const handleProductSelect = (product: Product) => {
    onSuccess(product);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualEntry();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Scan className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900" data-testid="barcode-scanner-title">
                Barcode Scanner
              </h2>
              <p className="text-gray-600 text-sm">Scan or search for products</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-scanner-btn">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Manual Entry */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Manual Search</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode, SKU, or product name"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  data-testid="barcode-input"
                />
                <Button 
                  onClick={handleManualEntry} 
                  disabled={isLoading}
                  data-testid="search-btn"
                >
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
                  <Button 
                    onClick={startCamera} 
                    variant="outline"
                    data-testid="start-camera-btn"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <Button 
                    onClick={stopCamera} 
                    variant="outline"
                    data-testid="stop-camera-btn"
                  >
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
                    muted
                    className="w-full h-64 object-cover"
                    data-testid="camera-video"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-32 border-2 border-teal-400 rounded-lg relative">
                      {/* Corner brackets */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-teal-400"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-teal-400"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-teal-400"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-teal-400"></div>
                      {/* Scanning line animation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-teal-400 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    Position barcode within the frame
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
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
                <h3 className="font-medium text-gray-900">
                  Search Results ({searchResults.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleProductSelect(product)}
                      data-testid={`product-result-${product.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-600">
                                {product.category} • SKU: {product.sku}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant="outline"
                                  className={product.isLowStock ? "border-red-200 text-red-800" : "border-green-200 text-green-800"}
                                >
                                  {product.totalStock} {product.unit} in stock
                                </Badge>
                                {product.isLowStock && (
                                  <Badge variant="outline" className="border-orange-200 text-orange-800">
                                    Low Stock
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {product.availableBatches} batch(es)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.length === 0 && scannedCode && !isLoading && !error && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 text-sm mb-4">
                  No products match "{scannedCode}". The product might not be in your inventory.
                </p>
                <Button 
                  onClick={onClose}
                  className="bg-teal-600 hover:bg-teal-700"
                  data-testid="close-no-results-btn"
                >
                  Close Scanner
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}