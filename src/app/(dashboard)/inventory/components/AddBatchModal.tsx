"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X, Save, Package, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

interface AddBatchModalProps {
  productId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface BatchFormData {
  batchNumber: string;
  productId: string;
  supplierId: string;
  mfgDate: string;
  expiryDate: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
  price: number;
}

interface Supplier {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export function AddBatchModal({ productId, onClose, onSuccess }: AddBatchModalProps) {
  const [formData, setFormData] = useState<BatchFormData>({
    batchNumber: "",
    productId,
    supplierId: "",
    mfgDate: "",
    expiryDate: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
  });
  
  const [product, setProduct] = useState<Product | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProductAndSuppliers();
  }, [productId]);

  const fetchProductAndSuppliers = async () => {
    setLoadingData(true);
    try {
      const [productResponse, suppliersResponse] = await Promise.all([
        fetch(`/api/products/${productId}`),
        fetch("/api/suppliers"),
      ]);

      if (productResponse.ok) {
        const productData = await productResponse.json();
        setProduct(productData.product);
        setFormData(prev => ({
          ...prev,
          sellingPrice: productData.product.price,
        }));
      }

      if (suppliersResponse.ok) {
        const suppliersData = await suppliersResponse.json();
        setSuppliers(suppliersData.suppliers || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading data");
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.batchNumber.trim()) newErrors.batchNumber = "Batch number is required";
    if (!formData.supplierId) newErrors.supplierId = "Supplier is required";
    if (!formData.mfgDate) newErrors.mfgDate = "Manufacturing date is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
    if (formData.costPrice <= 0) newErrors.costPrice = "Cost price must be greater than 0";
    if (formData.sellingPrice <= 0) newErrors.sellingPrice = "Selling price must be greater than 0";

    // Validate dates
    if (formData.mfgDate && formData.expiryDate) {
      const mfgDate = new Date(formData.mfgDate);
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      
      if (mfgDate > today) {
        newErrors.mfgDate = "Manufacturing date cannot be in the future";
      }
      
      if (expiryDate <= mfgDate) {
        newErrors.expiryDate = "Expiry date must be after manufacturing date";
      }
      
      if (expiryDate <= today) {
        newErrors.expiryDate = "Expiry date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Batch added successfully");
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add batch");
      }
    } catch (error) {
      console.error("Error adding batch:", error);
      toast.error("Error adding batch");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BatchFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const generateBatchNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const batchNumber = `BAT${year}${month}${day}${random}`;
    handleInputChange("batchNumber", batchNumber);
  };

  const getDaysToExpiry = (): number | null => {
    if (!formData.expiryDate) return null;
    const today = new Date();
    const expiry = new Date(formData.expiryDate);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = () => {
    const days = getDaysToExpiry();
    if (days === null) return null;
    
    if (days <= 0) {
      return { color: "text-red-600", message: "This batch is expired!" };
    } else if (days <= 30) {
      return { color: "text-orange-600", message: `Expires in ${days} days` };
    } else if (days <= 90) {
      return { color: "text-yellow-600", message: `Expires in ${days} days` };
    } else {
      return { color: "text-green-600", message: `Expires in ${days} days` };
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900" data-testid="add-batch-modal-title">
                Add New Batch
              </h2>
              {product && (
                <p className="text-gray-600 text-sm">
                  for {product.name} (SKU: {product.sku})
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-modal-btn">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Batch Identification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="batchNumber">Batch Number *</Label>
                <div className="flex gap-2">
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

              <div>
                <Label htmlFor="supplier">Supplier *</Label>
                <Select 
                  value={formData.supplierId} 
                  onValueChange={(value) => handleInputChange("supplierId", value)}
                >
                  <SelectTrigger className={errors.supplierId ? "border-red-500" : ""} data-testid="supplier-select">
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

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mfgDate">Manufacturing Date *</Label>
                <Input
                  id="mfgDate"
                  type="date"
                  value={formData.mfgDate}
                  onChange={(e) => handleInputChange("mfgDate", e.target.value)}
                  className={errors.mfgDate ? "border-red-500" : ""}
                  data-testid="mfg-date-input"
                />
                {errors.mfgDate && <p className="text-red-500 text-sm mt-1">{errors.mfgDate}</p>}
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  className={errors.expiryDate ? "border-red-500" : ""}
                  data-testid="expiry-date-input"
                />
                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                
                {/* Expiry Status */}
                {formData.expiryDate && (() => {
                  const status = getExpiryStatus();
                  return status && (
                    <div className={`flex items-center gap-2 mt-2 text-sm ${status.color}`}>
                      <AlertTriangle className="h-4 w-4" />
                      <span>{status.message}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Quantity and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantity">
                  Quantity * {product && `(${product.unit})`}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", Number(e.target.value) || 0)}
                  placeholder="0"
                  className={errors.quantity ? "border-red-500" : ""}
                  data-testid="quantity-input"
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <Label htmlFor="costPrice">Cost Price per Unit *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange("costPrice", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={errors.costPrice ? "border-red-500" : ""}
                  data-testid="cost-price-input"
                />
                {errors.costPrice && <p className="text-red-500 text-sm mt-1">{errors.costPrice}</p>}
              </div>

              <div>
                <Label htmlFor="sellingPrice">Selling Price per Unit</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange("sellingPrice", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={errors.sellingPrice ? "border-red-500" : ""}
                  data-testid="selling-price-input"
                />
                {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use product default (₹{product?.price.toFixed(2)})
                </p>
              </div>
            </div>

            {/* Summary Card */}
            {formData.quantity > 0 && formData.costPrice > 0 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-medium text-green-900 mb-2">Batch Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700">Total Cost:</span>
                      <span className="float-right font-medium">
                        ₹{(formData.quantity * formData.costPrice).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-700">Total Value:</span>
                      <span className="float-right font-medium">
                        ₹{(formData.quantity * formData.sellingPrice).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-700">Profit Margin:</span>
                      <span className="float-right font-medium">
                        {formData.sellingPrice > 0 
                          ? (((formData.sellingPrice - formData.costPrice) / formData.costPrice) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <div>
                      <span className="text-green-700">Total Profit:</span>
                      <span className="float-right font-medium">
                        ₹{(formData.quantity * (formData.sellingPrice - formData.costPrice)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            * Required fields must be filled
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} data-testid="cancel-btn">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              data-testid="save-batch-btn"
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
      </div>
    </div>
  );
}