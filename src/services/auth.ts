import { apiService } from './api';
import { LoginCredentials, LoginResponse, Admin, ApiError } from '../types/auth';

class AuthService {
  private readonly TOKEN_KEY = 'swiftgo_admin_token';
  private readonly USER_KEY = 'swiftgo_admin_user';
  private readonly REMEMBER_KEY = 'swiftgo_admin_remember';

  // Login functionality
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.login(credentials);
      
      // Store authentication data
      this.storeAuthData(response, credentials.rememberMe || false);
      
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Logout functionality
  async logout(): Promise<void> {
    const token = this.getToken();
    
    try {
      if (token) {
        await apiService.logout(token);
      }
    } catch (error) {
      // Even if API call fails, we should still clear local storage
      console.error('Logout API call failed:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Store authentication data
  private storeAuthData(response: LoginResponse, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem(this.TOKEN_KEY, response.token);
    storage.setItem(this.USER_KEY, JSON.stringify(response.admin));
    
    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_KEY, 'true');
    }

    // Clear the other storage type to avoid conflicts
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem(this.TOKEN_KEY);
    otherStorage.removeItem(this.USER_KEY);
    if (!rememberMe) {
      localStorage.removeItem(this.REMEMBER_KEY);
    }
  }

  // Clear all authentication data
  private clearAuthData(): void {
    // Clear from both storages
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  // Get stored user data
  getUser(): Admin | null {
    const userStr = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(this.getToken() && this.getUser());
  }

  // Check if remember me was selected
  isRemembered(): boolean {
    return localStorage.getItem(this.REMEMBER_KEY) === 'true';
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    const currentToken = this.getToken();
    if (!currentToken) return null;

    try {
      const response = await apiService.refreshToken(currentToken);
      
      // Update stored token
      const storage = this.isRemembered() ? localStorage : sessionStorage;
      storage.setItem(this.TOKEN_KEY, response.token);
      
      return response.token;
    } catch (error) {
      // If refresh fails, clear auth data
      this.clearAuthData();
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<Admin | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await apiService.getProfile(token);
      
      // Update stored user data
      const storage = this.isRemembered() ? localStorage : sessionStorage;
      storage.setItem(this.USER_KEY, JSON.stringify(response.admin));
      
      return response.admin;
    } catch (error) {
      // If profile fetch fails, clear auth data
      this.clearAuthData();
      throw error;
    }
  }

  // Initialize auth state (call on app startup)
  initializeAuth(): { isAuthenticated: boolean; user: Admin | null; token: string | null } {
    const token = this.getToken();
    const user = this.getUser();
    const isAuthenticated = !!(token && user);

    return {
      isAuthenticated,
      user,
      token
    };
  }
}

export const authService = new AuthService();
