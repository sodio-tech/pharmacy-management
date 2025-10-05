"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Eye, Plus, Trash2, AlertTriangle, Package } from "lucide-react";
import { toast } from "react-toastify";

interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: "OTC" | "PRESCRIPTION" | "SUPPLEMENT";
  unit: string;
  price: number;
  reorderLevel: number;
  totalStock: number;
  isLowStock: boolean;
  expiringSoonCount: number;
  batches: Array<{
    id: string;
    batchNumber: string;
    quantity: number;
    expiryDate: string;
    sellingPrice?: number;
  }>;
  createdAt: string;
}

interface ProductListProps {
  searchTerm: string;
  selectedCategory: string | null;
  activeFilter: string;
  onAddBatch: (productId: string) => void;
  onStatsUpdate: () => void;
}

export function ProductList({
  searchTerm,
  selectedCategory,
  activeFilter,
  onAddBatch,
  onStatsUpdate,
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, activeFilter, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (activeFilter === "lowStock") params.append("lowStock", "true");
      if (activeFilter === "expiringSoon") params.append("expiringSoon", "true");

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error: any) {
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        fetchProducts();
        onStatsUpdate();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete product");
      }
    } catch (error: any) {
      toast.error("Error deleting product");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "PRESCRIPTION":
        return "bg-blue-100 text-blue-800";
      case "OTC":
        return "bg-green-100 text-green-800";
      case "SUPPLEMENT":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.totalStock === 0) {
      return { text: "Out of Stock", color: "bg-red-100 text-red-800" };
    } else if (product.isLowStock) {
      return { text: "Low Stock", color: "bg-orange-100 text-orange-800" };
    } else {
      return { text: "In Stock", color: "bg-green-100 text-green-800" };
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" data-testid="products-table-title">
            Products ({products.length})
          </h2>
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Batches</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No products found</p>
                  <p className="text-sm text-gray-500">
                    {searchTerm || selectedCategory || activeFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Add your first product to get started"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => {
                const stockStatus = getStockStatus(product);
                const pageOffset = (page - 1) * 20;
                
                return (
                  <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                    <TableCell>{pageOffset + index + 1}</TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium" data-testid={`product-name-${product.id}`}>
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-600">SKU: {product.sku}</div>
                          {product.description && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getCategoryColor(product.category)} variant="outline">
                        {product.category}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={stockStatus.color} variant="outline">
                            {stockStatus.text}
                          </Badge>
                          {product.isLowStock && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.totalStock} {product.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          Reorder at: {product.reorderLevel}
                        </div>
                        {product.expiringSoonCount > 0 && (
                          <div className="text-xs text-orange-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {product.expiringSoonCount} batch(es) expiring soon
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium">₹{product.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">per {product.unit}</div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {product.batches.length} batch(es)
                        </div>
                        {product.batches.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Next expiry: {new Date(product.batches[0].expiryDate).toLocaleDateString()}
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddBatch(product.id)}
                          data-testid={`add-batch-btn-${product.id}`}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Batch
                        </Button>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`view-product-btn-${product.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`edit-product-btn-${product.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          data-testid={`delete-product-btn-${product.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, products.length)} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              data-testid="prev-page-btn"
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, page - 2) + i;
              if (pageNumber > totalPages) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={page === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNumber)}
                  data-testid={`page-${pageNumber}-btn`}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              data-testid="next-page-btn"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}