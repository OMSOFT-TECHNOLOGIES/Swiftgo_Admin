import { API_CONFIG, getAuthHeaders } from '../utils/apiConfig';
import { 
  LoginCredentials, 
  LoginResponse, 
  ApiError, 
  RidersResponse, 
  RidersFilters,
  PendingRidersResponse,
  ApprovalRequest,
  ApprovalResponse,
  OrdersResponse,
  OrdersFilters,
  Order,
  CustomersResponse,
  CustomerFilters,
  Customer
} from '../types/auth';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Generic fetch wrapper with error handling
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        try {
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            errorData = { message: await response.text() };
          }
        } catch (parseError) {
          errorData = { message: `Failed to parse error response: ${response.statusText}` };
        }
        
        const error: ApiError = {
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          errors: errorData.errors
        };
        throw error;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      
      // Network or other errors
      const apiError: ApiError = {
        message: 'Network error. Please check your connection and try again.',
        status: 0
      };
      throw apiError;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const requestBody = {
      email: credentials.email,
      password: credentials.password
    };

    const response = await this.request<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }
    );

    return response;
  }

  async logout(token: string): Promise<{ message: string }> {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
  }

  async refreshToken(token: string): Promise<{ token: string }> {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
  }

  async getProfile(token: string): Promise<{ admin: any }> {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.PROFILE, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  // Riders endpoints
  async getRiders(token: string, filters: RidersFilters = {}): Promise<RidersResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.status && filters.status !== 'all' as any) {
      queryParams.append('status', filters.status);
    }
    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.include_location) {
      queryParams.append('include_location', 'true');
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.RIDERS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return this.request<RidersResponse>(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  async createRider(token: string, riderData: any): Promise<any> {
    return this.request(API_CONFIG.ENDPOINTS.RIDERS.CREATE, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(riderData),
    });
  }

  async updateRider(token: string, riderId: string, riderData: any): Promise<any> {
    return this.request(`${API_CONFIG.ENDPOINTS.RIDERS.UPDATE}/${riderId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(riderData),
    });
  }

  async deleteRider(token: string, riderId: string): Promise<any> {
    return this.request(`${API_CONFIG.ENDPOINTS.RIDERS.DELETE}/${riderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
  }

  // Pending riders endpoints
  async getPendingRiders(token: string, filters: RidersFilters = {}): Promise<PendingRidersResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.RIDERS.PENDING}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return this.request<PendingRidersResponse>(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  async approveRider(token: string, riderId: string, approvalData: ApprovalRequest): Promise<ApprovalResponse> {
    return this.request<ApprovalResponse>(`${API_CONFIG.ENDPOINTS.RIDERS.APPROVE}/${riderId}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(approvalData),
    });
  }

  async rejectRider(token: string, riderId: string, rejectionData: { notes: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>(`${API_CONFIG.ENDPOINTS.RIDERS.APPROVE}/${riderId}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(rejectionData),
    });
  }

  // Orders endpoints
  async getOrders(token: string, filters: OrdersFilters = {}): Promise<OrdersResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.status && filters.status !== 'all') {
      queryParams.append('status', filters.status);
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.date_from) {
      queryParams.append('date_from', filters.date_from);
    }
    if (filters.date_to) {
      queryParams.append('date_to', filters.date_to);
    }
    if (filters.sort_by) {
      queryParams.append('sort_by', filters.sort_by);
    }
    if (filters.sort_order) {
      queryParams.append('sort_order', filters.sort_order);
    }
    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.ORDERS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return this.request<OrdersResponse>(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  async getOrderById(token: string, orderId: string): Promise<Order> {
    return this.request<Order>(`${API_CONFIG.ENDPOINTS.ORDERS.LIST}/${orderId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  async updateOrderStatus(token: string, orderId: string, status: string): Promise<{ message: string; order: Order }> {
    return this.request<{ message: string; order: Order }>(`${API_CONFIG.ENDPOINTS.ORDERS.UPDATE}/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status }),
    });
  }

  // Parcel Tracking Endpoint
  async trackParcel(parcelId: string): Promise<any> {
    return this.request<any>(`${API_CONFIG.ENDPOINTS.ORDERS.TRACK}/${parcelId}`, {
      method: 'GET',
    });
  }

  // Customer Management Endpoints
  async getCustomers(token: string, filters?: CustomerFilters): Promise<CustomersResponse> {
    console.log('API getCustomers called');
    console.log('Token available:', !!token);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'null');
    
    const queryParams = new URLSearchParams();
    
    if (filters?.status && filters.status !== 'all') {
      queryParams.append('status', filters.status);
    }
    if (filters?.search) {
      queryParams.append('search', filters.search);
    }
    if (filters?.page) {
      queryParams.append('page', filters.page.toString());
    }
    if (filters?.limit) {
      queryParams.append('limit', filters.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.USERS.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.USERS.LIST;
    
    const headers = getAuthHeaders(token);
    console.log('Request headers:', headers);
    console.log('Making request to endpoint:', endpoint);

    return this.request<CustomersResponse>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async getCustomerById(token: string, customerId: string): Promise<{ success: boolean; message: string; user: Customer }> {
    return this.request<{ success: boolean; message: string; user: Customer }>(`${API_CONFIG.ENDPOINTS.USERS.LIST}/${customerId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  }

  async updateCustomerStatus(token: string, customerId: string, status: string): Promise<{ message: string; user: Customer }> {
    return this.request<{ message: string; user: Customer }>(`${API_CONFIG.ENDPOINTS.USERS.LIST}/${customerId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status }),
    });
  }

  // Generic authenticated request
  async authenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...getAuthHeaders(token),
        ...options.headers,
      },
    });
  }
}

export const apiService = new ApiService();
