"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Save, Package } from "lucide-react";
import { toast } from "react-hot-toast";

interface AddProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  category: "OTC" | "PRESCRIPTION" | "SUPPLEMENT" | "";
  unit: string;
  hsnCode: string;
  gstRate: number;
  price: number;
  reorderLevel: number;
}

export function AddProductModal({ onClose, onSuccess }: AddProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    sku: "",
    name: "",
    description: "",
    category: "",
    unit: "",
    hsnCode: "",
    gstRate: 12,
    price: 0,
    reorderLevel: 10,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  const categories = [
    { value: "OTC", label: "OTC (Over The Counter)" },
    { value: "PRESCRIPTION", label: "Prescription Medicine" },
    { value: "SUPPLEMENT", label: "Supplement/Vitamin" },
  ];

  const units = [
    "tablets", "capsules", "ml", "mg", "grams", "units", "strips", "bottles", "tubes", "boxes"
  ];

  const gstRates = [0, 5, 12, 18, 28];

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};
    
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.reorderLevel < 0) newErrors.reorderLevel = "Reorder level cannot be negative";

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
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Product created successfully");
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const generateSKU = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const sku = `PRD${timestamp}${random}`.toUpperCase();
    handleInputChange("sku", sku);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900" data-testid="add-product-modal-title">
                Add New Product
              </h2>
              <p className="text-gray-600 text-sm">Create a new product in your inventory</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-modal-btn">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">
                  SKU (Stock Keeping Unit) *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Enter unique SKU"
                    className={errors.sku ? "border-red-500" : ""}
                    data-testid="sku-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSKU}
                    data-testid="generate-sku-btn"
                  >
                    Generate
                  </Button>
                </div>
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
              </div>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  className={errors.name ? "border-red-500" : ""}
                  data-testid="name-input"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Optional product description"
                data-testid="description-input"
              />
            </div>

            {/* Category and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""} data-testid="category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="unit">Unit *</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => handleInputChange("unit", value)}
                >
                  <SelectTrigger className={errors.unit ? "border-red-500" : ""} data-testid="unit-select">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
              </div>
            </div>

            {/* Pricing and Tax */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price per Unit *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={errors.price ? "border-red-500" : ""}
                  data-testid="price-input"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <Label htmlFor="gstRate">GST Rate (%)</Label>
                <Select 
                  value={formData.gstRate.toString()} 
                  onValueChange={(value) => handleInputChange("gstRate", parseInt(value))}
                >
                  <SelectTrigger data-testid="gst-rate-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gstRates.map((rate) => (
                      <SelectItem key={rate} value={rate.toString()}>
                        {rate}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  min="0"
                  value={formData.reorderLevel}
                  onChange={(e) => handleInputChange("reorderLevel", parseInt(e.target.value) || 0)}
                  placeholder="10"
                  className={errors.reorderLevel ? "border-red-500" : ""}
                  data-testid="reorder-level-input"
                />
                {errors.reorderLevel && <p className="text-red-500 text-sm mt-1">{errors.reorderLevel}</p>}
              </div>
            </div>

            {/* Optional Fields */}
            <div>
              <Label htmlFor="hsnCode">HSN Code (Optional)</Label>
              <Input
                id="hsnCode"
                value={formData.hsnCode}
                onChange={(e) => handleInputChange("hsnCode", e.target.value)}
                placeholder="HSN/SAC code for tax purposes"
                data-testid="hsn-code-input"
              />
            </div>

            {/* Summary Card */}
            {formData.price > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Product Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Base Price:</span>
                      <span className="float-right font-medium">₹{formData.price.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">GST ({formData.gstRate}%):</span>
                      <span className="float-right font-medium">
                        ₹{((formData.price * formData.gstRate) / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-2 border-t border-blue-200 pt-2">
                      <span className="text-blue-900 font-medium">Total Price:</span>
                      <span className="float-right font-bold text-blue-900">
                        ₹{(formData.price + (formData.price * formData.gstRate) / 100).toFixed(2)}
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
              data-testid="save-product-btn"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}