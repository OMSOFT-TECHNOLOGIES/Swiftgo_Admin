export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface Admin {
  id: string; // Changed from number to string to match API response
  email: string;
  type: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
  message: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Rider-related types
export interface Rider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'SUSPENDED' | 'ONLINE' | 'OFFLINE';
  availability: boolean;
  vehicle_details?: {
    type: string;
    model: string;
    color?: string;
    plate_number?: string;
  };
  current_location?: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    } | null;
    last_updated: string;
  };
  performance?: {
    total_deliveries: number;
    completed_deliveries: number;
    completion_rate: number;
    average_rating: number | null;
    total_earnings: number;
  };
  // Legacy fields for backward compatibility
  total_deliveries?: number;
  completed_deliveries?: number;
  average_rating?: number | null;
  is_verified?: boolean;
  national_id?: string;
  location?: {
    latitude: number;
    longitude: number;
    last_updated?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface RidersResponse {
  message: string;
  riders: Rider[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_riders: number;
    limit: number;
  };
}

export interface RidersFilters {
  status?: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'SUSPENDED' | 'ONLINE' | 'OFFLINE';
  page?: number;
  limit?: number;
  search?: string;
  include_location?: boolean;
}

// Pending rider application types
export interface PendingRiderApplication {
  id: number;
  name: string;
  email: string;
  vehicle_details: {
    type: string;
    model: string;
  };
  national_id: string;
  is_verified: boolean;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  created_at: string;
}

export interface PendingRidersResponse {
  message: string;
  riders: PendingRiderApplication[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_riders: number;
    limit: number;
  };
}

export interface ApprovalRequest {
  notes?: string;
}

export interface ApprovalResponse {
  message: string;
  rider: {
    id: string;
    name: string;
    email: string;
    status: string;
    availability: boolean;
    updated_at: string;
  };
  approved_by: string;
  approval_notes?: string;
}

// Order-related types
export interface Order {
  id: string;
  tracking_number: string;
  pickup_address: string;
  delivery_address: string;
  description: string;
  delivery_info: {
    name: string;
    phone: string;
  };
  status: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
  parcel_size: 'small' | 'medium' | 'large';
  distance_km: number;
  delivery_fee: number;
  rating: number | null;
  rating_comment: string | null;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  rider: any | null;
  payment: any | null;
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  orders: Order[];
  summary: {
    total_orders: number;
    pending_orders: number;
    in_transit_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    total_revenue: number;
    average_order_value: number;
    average_rating: number;
  };
  pagination: {
    current_page: number;
    total_pages: number;
    total_orders: number;
    limit: number;
  };
  filters: {
    status: string;
    search: string | null;
    date_from: string | null;
    date_to: string | null;
    sort_by: string;
    sort_order: string;
  };
}

export interface OrdersFilters {
  status?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

// Customer-related types
export interface Customer {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  is_verified: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  auth_provider: string;
  created_at: string;
  updated_at: string;
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_spent: number;
  average_rating_given: number | null;
}

export interface CustomersResponse {
  success: boolean;
  message: string;
  users: Customer[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_users: number;
    limit: number;
  };
  filters: {
    status: string;
    search: string | null;
  };
}

export interface CustomerFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
