
"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Filter, Package, AlertTriangle, Calendar, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ProductList } from "./components/ProductList";
import { AddProductModal } from "./components/AddProductModal";
import { AddBatchModal } from "./components/AddBatchModal";
import { BarcodeScanner } from "./components/BarcodeScanner";
import { StockAlerts } from "./components/StockAlerts";
import { toast } from "react-hot-toast";
import LayoutSkeleton from "@/components/layout-skeleton";
import DynamicHeader from "@/components/DynamicHeader";

interface InventoryStats {
  totalProducts: number;
  lowStockCount: number;
  expiringSoonCount: number;
  totalStockValue: number;
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
    totalStockValue: 0,
  });

  const categories = ["OTC", "PRESCRIPTION", "SUPPLEMENT"];
  const filterOptions = [
    { key: "all", label: "All Products", icon: Package },
    { key: "lowStock", label: "Low Stock", icon: AlertTriangle },
    { key: "expiringSoon", label: "Expiring Soon", icon: Calendar },
  ];

  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchInventoryStats();
  }, []);

  const fetchInventoryStats = async () => {
    try {
      const response = await fetch("/api/inventory/stock");
      if (response.ok) {
        const data = await response.json();
        setStats(data.summary);
      }
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
    }
  };

  const handleProductAdded = () => {
    setShowAddProduct(false);
    fetchInventoryStats();
    toast.success("Product added successfully!");
  };

  const handleBatchAdded = () => {
    setShowAddBatch(false);
    setSelectedProductId(null);
    fetchInventoryStats();
    toast.success("Batch added successfully!");
  };

  const handleBarcodeScanned = (productData: any) => {
    setShowScanner(false);
    toast.success(`Product found: ${productData.name}`);
    // You could redirect to product details or open edit modal here
  };

  const InventoryContent = () => (
    <div className="bg-[#f9fafb] min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4" data-testid="total-products-card">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
              <p className="text-gray-600 text-sm">Total Products</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4" data-testid="low-stock-card">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{stats.lowStockCount}</p>
              <p className="text-gray-600 text-sm">Low Stock</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4" data-testid="expiring-soon-card">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{stats.expiringSoonCount}</p>
              <p className="text-gray-600 text-sm">Expiring Soon</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4" data-testid="stock-value-card">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{stats.totalStockValue}</p>
              <p className="text-gray-600 text-sm">Total Stock Units</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by product name, SKU, or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="product-search-input"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              data-testid="category-all"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                data-testid={`category-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="toggle-filters-btn"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <Button
                    key={filter.key}
                    variant={activeFilter === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter.key)}
                    data-testid={`filter-${filter.key}`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Product List */}
      <ProductList
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        activeFilter={activeFilter}
        onAddBatch={(productId) => {
          setSelectedProductId(productId);
          setShowAddBatch(true);
        }}
        onStatsUpdate={fetchInventoryStats}
      />

      {/* Modals */}
      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onSuccess={handleProductAdded}
        />
      )}

      {showAddBatch && selectedProductId && (
        <AddBatchModal
          productId={selectedProductId}
          onClose={() => {
            setShowAddBatch(false);
            setSelectedProductId(null);
          }}
          onSuccess={handleBatchAdded}
        />
      )}

      {showScanner && (
        <BarcodeScanner
          onClose={() => setShowScanner(false)}
          onSuccess={handleBarcodeScanned}
        />
      )}

      {showAlerts && (
        <StockAlerts
          onClose={() => setShowAlerts(false)}
          onRefresh={fetchInventoryStats}
        />
      )}
    </div>
  );

  return (
    <LayoutSkeleton
      header={
        <DynamicHeader
          maintext="Inventory Management"
          para="Manage your pharmacy stock and medicine inventory"
          children={
            <div className="flex items-center gap-3">
              <Button
                className="bg-[#0f766e] hover:bg-[#0d6660] text-white gap-2"
                onClick={() => setShowAddProduct(true)}
                data-testid="header-add-product-btn"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
              <Button
                className="bg-[#14b8a6] hover:bg-[#0f9488] text-white gap-2"
                onClick={() => setShowScanner(true)}
                data-testid="header-scan-barcode-btn"
              >
                <Scan className="w-4 h-4" />
                Scan Barcode
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white gap-2"
                onClick={() => setShowAlerts(true)}
                data-testid="header-alerts-btn"
              >
                <AlertTriangle className="w-4 h-4" />
                Alerts ({stats.lowStockCount + stats.expiringSoonCount})
              </Button>
            </div>
          }
        />
      }
    >
      <InventoryContent />
    </LayoutSkeleton>
  );
}