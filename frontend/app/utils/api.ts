const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface Receipt {
  _id: string;
  userId: string;
  tripId?: string;
  store: string;
  storeKr: string;
  tel: string;
  address: string;
  addressKr: string;
  date: string;
  time: string;
  receiptNo: string;
  cashierNo: string;
  items: Array<{
    code: string;
    name: string;
    nameKr: string;
    price: number;
    priceKr: number;
    quantity: number;
    tax: string;
  }>;
  subtotal: number;
  subtotalKr: number;
  tax: number;
  taxKr: number;
  total: number;
  totalKr: number;
  totalAmount: number;
  exchangeRate: number;
  paymentMethod: string;
  paymentMethodKr: string;
  change: number;
  changeKr: number;
  category: string;
  storeType: string;
  productTypes: string[];
  createdAt: string;
  updatedAt: string;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Receipt API functions
export const receiptApi = {
  // Get all receipts
  getAll: () => apiCall<Receipt[]>('/receipts'),
  
  // Get single receipt
  getById: (id: string) => apiCall<Receipt>(`/receipts/${id}`),
  
  // Create receipt
  create: (data: Partial<Receipt>) => 
    apiCall<Receipt>('/receipts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update receipt
  update: (id: string, data: Partial<Receipt>) =>
    apiCall<Receipt>(`/receipts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete receipt
  delete: (id: string) =>
    apiCall<{ message: string }>(`/receipts/${id}`, {
      method: 'DELETE',
    }),
};

// Trip API functions
export const tripApi = {
  // Get all trips
  getAll: () => apiCall<any[]>('/trips'),
  
  // Get single trip
  getById: (id: string) => apiCall<any>(`/trips/${id}`),
  
  // Update trip budget
  updateBudget: (id: string, budget: any) =>
    apiCall<any>(`/trips/${id}/budget`, {
      method: 'PUT',
      body: JSON.stringify({ budget }),
    }),
};
