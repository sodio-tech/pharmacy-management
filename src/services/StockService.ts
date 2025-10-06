import backendApi from '@/lib/axios-config';

// Enhanced types for stock management
export interface StockReservation {
  id: string;
  productId: string;
  batchId?: string;
  quantity: number;
  reservationType: 'SALE' | 'TRANSFER' | 'ADJUSTMENT';
  referenceId?: string;
  expiresAt: string;
  userId?: string;
  createdAt: string;
}

export interface StockOperation {
  productId: string;
  batchId?: string;
  quantity: number;
  operationType: 'SALE' | 'PURCHASE' | 'ADJUSTMENT' | 'TRANSFER';
  reason?: string;
  userId?: string;
  referenceId?: string;
}

export interface StockValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BatchStock {
  batchId: string;
  batchNumber: string;
  availableQuantity: number;
  expiryDate: string;
  costPrice: number;
  daysUntilExpiry: number;
}

export interface StockSummary {
  productId: string;
  productName: string;
  barcode?: string;
  currentStock: number;
  availableStock: number;
  reservedStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  stockValue: number;
  batches: BatchStock[];
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  batchId?: string;
  batchNumber?: string;
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  reason?: string;
  referenceId?: string;
  userName?: string;
  createdAt: string;
}

export interface StockHistoryFilters {
  productId?: string;
  batchId?: string;
  movementType?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

class StockService {
  private static instance: StockService;
  private stockCache: Map<string, StockSummary> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  /**
   * Get stock summary with caching
   */
  async getStockSummary(productId: string, forceRefresh: boolean = false): Promise<StockSummary> {
    const cacheKey = `stock_${productId}`;
    const now = Date.now();
    
    // Check cache
    if (!forceRefresh && this.stockCache.has(cacheKey)) {
      const expiry = this.cacheExpiry.get(cacheKey) || 0;
      if (now < expiry) {
        return this.stockCache.get(cacheKey)!;
      }
    }

    try {
      const response = await backendApi.get(`/stock/summary/${productId}`);
      const stockSummary = response.data.data;
      
      // Cache the result
      this.stockCache.set(cacheKey, stockSummary);
      this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
      
      return stockSummary;
    } catch (error) {
      console.error('Error fetching stock summary:', error);
      throw new Error('Failed to fetch stock summary');
    }
  }

  /**
   * Reserve stock for a pending transaction
   */
  async reserveStock(reservation: Omit<StockReservation, 'id' | 'createdAt'>): Promise<StockReservation> {
    try {
      const response = await backendApi.post('/stock/reserve', reservation);
      const reservationData = response.data.data;
      
      // Invalidate cache for this product
      this.invalidateProductCache(reservation.productId);
      
      return reservationData;
    } catch (error: any) {
      console.error('Error reserving stock:', error);
      throw new Error(error.response?.data?.error || 'Failed to reserve stock');
    }
  }

  /**
   * Execute stock operation
   */
  async executeStockOperation(operation: StockOperation): Promise<string> {
    try {
      const response = await backendApi.post('/stock/execute', operation);
      const operationId = response.data.data.operationId;
      
      // Invalidate cache for this product
      this.invalidateProductCache(operation.productId);
      
      return operationId;
    } catch (error: any) {
      console.error('Error executing stock operation:', error);
      throw new Error(error.response?.data?.error || 'Failed to execute stock operation');
    }
  }

  /**
   * Release stock reservation
   */
  async releaseStockReservation(reservationId: string): Promise<void> {
    try {
      await backendApi.delete(`/stock/reserve/${reservationId}`);
      
      // Invalidate all caches since we don't know which product
      this.clearAllCache();
    } catch (error: any) {
      console.error('Error releasing stock reservation:', error);
      throw new Error(error.response?.data?.error || 'Failed to release stock reservation');
    }
  }

  /**
   * Validate stock availability
   */
  async validateStockAvailability(
    productId: string, 
    quantity: number, 
    batchId?: string
  ): Promise<StockValidationResult> {
    try {
      const response = await backendApi.post('/stock/validate', {
        productId,
        quantity,
        batchId
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error validating stock:', error);
      throw new Error(error.response?.data?.error || 'Failed to validate stock');
    }
  }

  /**
   * Get FIFO batches for a product
   */
  async getFIFOBatches(productId: string, quantity: number): Promise<BatchStock[]> {
    try {
      const response = await backendApi.get(`/stock/fifo/${productId}?quantity=${quantity}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching FIFO batches:', error);
      throw new Error('Failed to fetch FIFO batches');
    }
  }

  /**
   * Get stock movement history
   */
  async getStockHistory(filters: StockHistoryFilters = {}): Promise<StockMovement[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.productId) params.append('productId', filters.productId);
      if (filters.batchId) params.append('batchId', filters.batchId);
      if (filters.movementType) params.append('movementType', filters.movementType);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await backendApi.get(`/stock/history?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stock history:', error);
      throw new Error('Failed to fetch stock history');
    }
  }

  /**
   * Get available stock (current - reserved)
   */
  async getAvailableStock(productId: string, branchId?: string): Promise<number> {
    try {
      const params = branchId ? `?branchId=${branchId}` : '';
      const response = await backendApi.get(`/stock/available/${productId}${params}`);
      return response.data.data.availableStock;
    } catch (error) {
      console.error('Error fetching available stock:', error);
      throw new Error('Failed to fetch available stock');
    }
  }

  /**
   * Process sale with stock validation and reservation
   */
  async processSale(saleItems: Array<{
    productId: string;
    batchId?: string;
    quantity: number;
  }>): Promise<{
    reservationIds: string[];
    isValid: boolean;
    errors: string[];
  }> {
    const reservationIds: string[] = [];
    const errors: string[] = [];
    
    try {
      // First, validate all items
      for (const item of saleItems) {
        const validation = await this.validateStockAvailability(
          item.productId, 
          item.quantity, 
          item.batchId
        );
        
        if (!validation.isValid) {
          errors.push(...validation.errors);
        }
      }

      if (errors.length > 0) {
        return { reservationIds: [], isValid: false, errors };
      }

      // Reserve stock for all items
      for (const item of saleItems) {
        const reservation = await this.reserveStock({
          productId: item.productId,
          batchId: item.batchId,
          quantity: item.quantity,
          reservationType: 'SALE',
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        });
        
        reservationIds.push(reservation.id);
      }

      return { reservationIds, isValid: true, errors: [] };
    } catch (error: any) {
      console.error('Error processing sale:', error);
      throw new Error(error.message || 'Failed to process sale');
    }
  }

  /**
   * Complete sale by executing stock operations
   */
  async completeSale(
    reservationIds: string[], 
    saleItems: Array<{
      productId: string;
      batchId?: string;
      quantity: number;
      referenceId?: string;
    }>
  ): Promise<void> {
    try {
      // Execute stock operations
      for (let i = 0; i < saleItems.length; i++) {
        const item = saleItems[i];
        await this.executeStockOperation({
          productId: item.productId,
          batchId: item.batchId,
          quantity: item.quantity,
          operationType: 'SALE',
          referenceId: item.referenceId,
          reason: 'Sale transaction'
        });
      }

      // Release reservations
      for (const reservationId of reservationIds) {
        await this.releaseStockReservation(reservationId);
      }
    } catch (error: any) {
      console.error('Error completing sale:', error);
      
      // Try to release reservations on error
      for (const reservationId of reservationIds) {
        try {
          await this.releaseStockReservation(reservationId);
        } catch (releaseError) {
          console.error('Error releasing reservation:', releaseError);
        }
      }
      
      throw new Error(error.message || 'Failed to complete sale');
    }
  }

  /**
   * Cancel sale and release reservations
   */
  async cancelSale(reservationIds: string[]): Promise<void> {
    try {
      for (const reservationId of reservationIds) {
        await this.releaseStockReservation(reservationId);
      }
    } catch (error: any) {
      console.error('Error canceling sale:', error);
      throw new Error(error.message || 'Failed to cancel sale');
    }
  }

  /**
   * Get real-time stock updates via WebSocket
   */
  subscribeToStockUpdates(productId: string, callback: (stockSummary: StockSummary) => void): () => void {
    // This would integrate with WebSocket for real-time updates
    // For now, we'll use polling
    const interval = setInterval(async () => {
      try {
        const stockSummary = await this.getStockSummary(productId, true);
        callback(stockSummary);
      } catch (error) {
        console.error('Error fetching real-time stock update:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }

  /**
   * Invalidate cache for a specific product
   */
  private invalidateProductCache(productId: string): void {
    const cacheKey = `stock_${productId}`;
    this.stockCache.delete(cacheKey);
    this.cacheExpiry.delete(cacheKey);
  }

  /**
   * Clear all cache
   */
  private clearAllCache(): void {
    this.stockCache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Get batch details with expiry information
   */
  async getBatchDetails(batchId: string): Promise<{
    batchId: string;
    batchNumber: string;
    productName: string;
    currentQuantity: number;
    expiryDate: string;
    daysUntilExpiry: number;
    costPrice: number;
    isExpired: boolean;
    isExpiringSoon: boolean;
  }> {
    try {
      const response = await backendApi.get(`/stock/batch/${batchId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching batch details:', error);
      throw new Error('Failed to fetch batch details');
    }
  }

  /**
   * Get expiring batches
   */
  async getExpiringBatches(days: number = 30): Promise<BatchStock[]> {
    try {
      const response = await backendApi.get(`/stock/expiring?days=${days}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching expiring batches:', error);
      throw new Error('Failed to fetch expiring batches');
    }
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(): Promise<Array<{
    productId: string;
    productName: string;
    currentStock: number;
    minStockLevel: number;
    availableStock: number;
    category: string;
    barcode?: string;
  }>> {
    try {
      const response = await backendApi.get('/stock/low-stock');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw new Error('Failed to fetch low stock products');
    }
  }
}

export const stockService = StockService.getInstance();
export default stockService;
