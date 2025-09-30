const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Users methods
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.role) searchParams.append('role', params.role);
    if (params?.search) searchParams.append('search', params.search);

    return this.request(`/users?${searchParams.toString()}`);
  }

  async updateUserRole(userId: string, role: string) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Products methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    lowStock?: boolean;
    expiringSoon?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.lowStock) searchParams.append('lowStock', 'true');
    if (params?.expiringSoon) searchParams.append('expiringSoon', 'true');

    return this.request(`/products?${searchParams.toString()}`);
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async getProduct(productId: string) {
    return this.request(`/products/${productId}`);
  }

  async updateProduct(productId: string, productData: any) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async searchProducts(query: string, category?: string) {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    if (category) searchParams.append('category', category);

    return this.request(`/products/search?${searchParams.toString()}`);
  }

  // Inventory methods
  async getStock(params?: {
    productId?: string;
    lowStock?: boolean;
    expiringSoon?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.productId) searchParams.append('productId', params.productId);
    if (params?.lowStock) searchParams.append('lowStock', 'true');
    if (params?.expiringSoon) searchParams.append('expiringSoon', 'true');

    return this.request(`/inventory/stock?${searchParams.toString()}`);
  }

  async getBatches(params?: {
    productId?: string;
    supplierId?: string;
    expiringSoon?: boolean;
    lowStock?: boolean;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.productId) searchParams.append('productId', params.productId);
    if (params?.supplierId) searchParams.append('supplierId', params.supplierId);
    if (params?.expiringSoon) searchParams.append('expiringSoon', 'true');
    if (params?.lowStock) searchParams.append('lowStock', 'true');
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    return this.request(`/batches?${searchParams.toString()}`);
  }

  async addBatch(batchData: any) {
    return this.request('/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  }

  // Suppliers methods
  async getSuppliers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);

    return this.request(`/suppliers?${searchParams.toString()}`);
  }

  async createSupplier(supplierData: any) {
    return this.request('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  }

  // Prescriptions methods
  async getPrescriptions(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);

    return this.request(`/prescriptions?${searchParams.toString()}`);
  }

  async getPrescription(prescriptionId: string) {
    return this.request(`/prescriptions/${prescriptionId}`);
  }

  async createPrescription(prescriptionData: any) {
    return this.request('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
  }

  async validatePrescription(prescriptionId: string, status: 'VALIDATED' | 'REJECTED', notes?: string) {
    return this.request(`/prescriptions/${prescriptionId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async uploadPrescription(formData: FormData) {
    return this.request('/prescriptions/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // Sales methods
  async getSales(params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.search) searchParams.append('search', params.search);

    return this.request(`/sales?${searchParams.toString()}`);
  }

  async createSale(saleData: any) {
    return this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  // Reports methods
  async getDashboardData() {
    return this.request('/reports/dashboard');
  }
}

export const api = new ApiClient();