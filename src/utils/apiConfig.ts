// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login/admin',
      USER_LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
      GOOGLE_AUTH: '/api/auth/google',
      GOOGLE_CALLBACK: '/api/auth/google/callback',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      PROFILE: '/api/auth/profile',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password'
    },
    ORDERS: {
      LIST: '/api/admin/orders',
      CREATE: '/api/parcels',
      UPDATE: '/api/admin/orders',
      DELETE: '/api/admin/orders',
      TRACK: '/api/riders/track',
      ESTIMATE: '/api/parcels/estimate'
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
