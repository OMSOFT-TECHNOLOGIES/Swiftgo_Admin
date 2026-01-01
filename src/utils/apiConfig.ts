// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.swiftgo.com',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login/admin',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      PROFILE: '/api/auth/profile'
    },
    ORDERS: {
      LIST: '/api/admin/orders',
      CREATE: '/api/admin/orders',
      UPDATE: '/api/admin/orders',
      DELETE: '/api/admin/orders',
      TRACK: '/api/riders/track'
    },
    RIDERS: {
      LIST: '/api/admin/riders',
      CREATE: '/api/admin/riders',
      UPDATE: '/api/admin/riders',
      DELETE: '/api/admin/riders',
      PENDING: '/api/admin/riders/pending',
      APPROVE: '/api/admin/riders'
    },
    USERS: {
      LIST: '/api/admin/users',
      CREATE: '/api/admin/users',
      UPDATE: '/api/admin/users',
      DELETE: '/api/admin/users'
    },
    CUSTOMERS: {
      LIST: '/api/customers',
      CREATE: '/api/customers',
      UPDATE: '/api/customers',
      DELETE: '/api/customers'
    },
    ANALYTICS: {
      DASHBOARD: '/api/analytics/dashboard',
      REPORTS: '/api/analytics/reports'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  TIMEOUT: 10000 // 10 seconds
};

// Request interceptor for adding auth token
export const getAuthHeaders = (token?: string | null): Record<string, string> => {
  const headers: Record<string, string> = { ...API_CONFIG.HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
