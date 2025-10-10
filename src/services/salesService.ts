import backendApi from '@/lib/axios-config';

export interface Customer {
  id?: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  doctor_name: string;
  doctor_license?: string;
  doctor_phone?: string;
  prescription_photo?: string;
  prescription_text?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaleItem {
  id?: string;
  sale_id?: string;
  product_id: string;
  batch_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_amount?: number;
  created_at?: string;
  updated_at?: string;
  product?: {
    id: string;
    name: string;
    generic_name?: string;
    category: string;
    manufacturer?: string;
    unit_of_measure: string;
  };
  batch?: {
    id: string;
    batch_number: string;
    expiry_date?: string;
  };
}

export interface Payment {
  id?: string;
  sale_id?: string;
  payment_method: 'CASH' | 'CARD' | 'UPI' | 'WALLET' | 'NET_BANKING' | 'CHEQUE';
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  amount: number;
  transaction_id?: string;
  payment_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  id?: string;
  sale_number?: string;
  customer_id?: string;
  cashier_id?: string;
  status?: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  notes?: string;
  prescription_id?: string;
  created_at?: string;
  updated_at?: string;
  customer?: Customer;
  items: SaleItem[];
  payments: Payment[];
  cashier?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateSaleRequest {
  customer?: Customer;
  items: Array<{
    product_id: string;
    batch_id?: string;
    quantity: number;
    unit_price: number;
    discount_amount?: number;
  }>;
  notes?: string;
  prescription_id?: string;
  payment_method: 'CASH' | 'CARD' | 'UPI' | 'WALLET' | 'NET_BANKING' | 'CHEQUE';
  discount_amount?: number;
}

export interface SalesStats {
  total_sales: number;
  total_amount: number;
  total_transactions: number;
  average_sale: number;
}

export interface Transaction {
  id: string;
  customer: string;
  items: number;
  amount: number;
  time: string;
  status: string;
}

export interface SalesFilters {
  status?: string;
  customer_id?: string;
  cashier_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface SalesStatsFilters {
  start_date?: string;
  end_date?: string;
  cashier_id?: string;
}

class SalesService {
  // Sale operations
  async createSale(saleData: CreateSaleRequest): Promise<Sale> {
    const response = await backendApi.post('/sales', saleData);
    return response.data.data;
  }

  async completeSale(saleId: string): Promise<Sale> {
    const response = await backendApi.post(`/sales/${saleId}/complete`);
    return response.data.data;
  }

  async cancelSale(saleId: string, reason: string): Promise<Sale> {
    const response = await backendApi.post(`/sales/${saleId}/cancel`, { reason });
    return response.data.data;
  }

  async getSaleById(saleId: string): Promise<Sale> {
    const response = await backendApi.get(`/sales/${saleId}`);
    return response.data.data;
  }

  async getSaleByNumber(saleNumber: string): Promise<Sale> {
    const response = await backendApi.get(`/sales/number/${saleNumber}`);
    return response.data.data;
  }

  async listSales(filters: SalesFilters = {}): Promise<Sale[]> {
    const response = await backendApi.get('/sales', { params: filters });
    return response.data.data;
  }

  async getSalesStats(filters: SalesStatsFilters = {}): Promise<SalesStats> {
    const response = await backendApi.get('/sales/stats/overview', { params: filters });
    return response.data.data;
  }

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    const response = await backendApi.get('/sales/transactions/recent', { 
      params: { limit } 
    });
    return response.data.data;
  }

  // Customer operations
  async searchCustomers(searchTerm: string, limit: number = 10): Promise<Customer[]> {
    const response = await backendApi.get('/sales/customers/search', {
      params: { search: searchTerm, limit }
    });
    return response.data.data;
  }

  async saveCustomer(customerData: Customer): Promise<Customer> {
    const response = await backendApi.post('/sales/customers', customerData);
    return response.data.data;
  }

  async getCustomerById(customerId: string): Promise<Customer> {
    const response = await backendApi.get(`/sales/customers/${customerId}`);
    return response.data.data;
  }

  async getCustomerByPhone(phone: string): Promise<Customer> {
    const response = await backendApi.get(`/sales/customers/phone/${phone}`);
    return response.data.data;
  }

  // Helper methods
  async processCheckout(cartItems: any[], customer: Customer, paymentMethod: string, notes?: string): Promise<Sale> {
    const saleData: CreateSaleRequest = {
      customer,
      items: cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        discount_amount: 0
      })),
      payment_method: paymentMethod as any,
      notes,
      discount_amount: 0
    };

    try {
      // Create sale
      const sale = await this.createSale(saleData);
      
      // Check if sale was created successfully and has an ID
      if (!sale || !sale.id) {
        console.error('Sale creation failed - no sale ID returned:', sale);
        throw new Error('Failed to create sale - no sale ID returned');
      }
      
      console.log('Sale created successfully with ID:', sale.id);
      
      // Complete sale
      const completedSale = await this.completeSale(sale.id);
      
      return completedSale;
    } catch (error) {
      console.error('Process checkout error:', error);
      throw error;
    }
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get relative time (e.g., "2 mins ago")
  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} secs ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  // Calculate totals for cart
  calculateCartTotals(items: any[]): {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = 0; // You can implement discount logic here
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.12; // 12% GST
    const total = taxableAmount + tax;

    return {
      subtotal,
      tax,
      discount,
      total
    };
  }
}

export const salesService = new SalesService();
