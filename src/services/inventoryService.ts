import backendApi from '@/lib/axios-config';

// Types for inventory data
export interface InventorySummary {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  expiringSoonCount: number;
  totalStockValue: number;
  totalStockUnits: number;
  turnoverRate: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  currentStock: number;
  minStockLevel: number;
  category: string;
  barcode: string;
}

export interface ExpiringProduct {
  id: string;
  name: string;
  batches: {
    id: string;
    batchNumber: string;
    quantity: number;
    expiryDate: string;
    daysUntilExpiry: number;
  }[];
}

export interface StockMovement {
  id: string;
  productName: string;
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  reason: string;
  createdAt: string;
  batchNumber?: string;
  userName?: string;
}

export interface InventoryData {
  summary: InventorySummary;
  alerts: {
    lowStockProducts: LowStockProduct[];
    expiringProducts: ExpiringProduct[];
  };
  recentMovements: StockMovement[];
  lastUpdated: string;
}

export interface ProductStock {
  product: {
    id: string;
    name: string;
    category: string;
    barcode: string;
    minStockLevel: number;
    maxStockLevel: number;
  };
  stock: {
    totalStock: number;
    stockValue: number;
    batches: {
      id: string;
      batchNumber: string;
      currentQuantity: number;
      costPrice: number;
      expiryDate: string;
      daysUntilExpiry: number;
    }[];
  };
  movements: StockMovement[];
}

export interface Product {
  id: string;
  name: string;
  generic_name?: string;
  description?: string;
  image_url?: string;
  category: string;
  requires_prescription: boolean;
  qr_code?: string;
  manufacturer?: string;
  barcode?: string;
  pack_size?: number;
  unit_price: number;
  selling_price: number;
  unit_of_measure: string;
  min_stock_level: number;
  max_stock_level?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  supplier_id?: string;
  page?: number;
  limit?: number;
  lowStock?: boolean;
  expiringSoon?: boolean;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

class InventoryService {
  // Get inventory stock summary
  async getInventoryStock(): Promise<InventoryData> {
    try {
      const response = await backendApi.get('/inventory/stock');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching inventory stock:', error);
      throw new Error('Failed to fetch inventory data');
    }
  }

  // Get product stock details
  async getProductStock(productId: string): Promise<ProductStock> {
    try {
      const response = await backendApi.get(`/inventory/stock/${productId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product stock:', error);
      throw new Error('Failed to fetch product stock data');
    }
  }

  // Get all products with filters
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.supplier_id) params.append('supplier_id', filters.supplier_id);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.lowStock) params.append('lowStock', 'true');
      if (filters.expiringSoon) params.append('expiringSoon', 'true');

      const response = await backendApi.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  // Get product by ID
  async getProductById(productId: string): Promise<Product> {
    try {
      const response = await backendApi.get(`/products/${productId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  // Get product by barcode
  async getProductByBarcode(barcode: string): Promise<Product> {
    try {
      const response = await backendApi.get(`/products/barcode/${barcode}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      throw new Error('Failed to fetch product by barcode');
    }
  }

  // Create new product
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await backendApi.post('/products', productData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  // Update product
  async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await backendApi.put(`/products/${productId}`, productData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  // Delete product
  async deleteProduct(productId: string): Promise<void> {
    try {
      await backendApi.delete(`/products/${productId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  // Search products
  async searchProducts(query: string, category?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (category) params.append('category', category);
      
      const response = await backendApi.get(`/products/search?${params.toString()}`);
      return response.data.products || [];
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;
