import { apiService } from './api';
import { LoginCredentials, SignupData, LoginResponse, Admin, ApiError } from '../types/auth';

class AuthService {
  private readonly TOKEN_KEY = 'swiftgo_admin_token';
  private readonly USER_KEY = 'swiftgo_admin_user';
  private readonly REMEMBER_KEY = 'swiftgo_admin_remember';

  // Login functionality
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.login(credentials);
      console.log('Login response received:', response);
      // Store authentication data
      this.storeAuthData(response, credentials.rememberMe || false);
      
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Signup functionality
  async signup(signupData: SignupData): Promise<LoginResponse> {
    try {
      const response = await apiService.signup(signupData);
      console.log('Signup response received:', response);
      // Store authentication data immediately after successful signup
      this.storeAuthData(response, false); // Don't remember signup sessions by default
      
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Google OAuth authentication
  async googleAuth(): Promise<void> {
    try {
      // For redirect_uri_mismatch issues, use direct redirect instead of popup
      const googleAuthUrl = apiService.getGoogleAuthUrl();
      
      // Store current location to redirect back after auth
      sessionStorage.setItem('swiftgo_pre_auth_url', window.location.pathname);
      
      // Direct redirect to Google OAuth
      window.location.href = googleAuthUrl;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Handle Google OAuth callback (called after redirect from Google)
  async handleGoogleAuthCallback(): Promise<LoginResponse | null> {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userStr = urlParams.get('user');
      const error = urlParams.get('error');
      
      if (error) {
        throw new Error(`Google authentication failed: ${error}`);
      }
      
      if (token && userStr) {
        // Backend has already processed the OAuth and returned token + user data
        const userData = JSON.parse(decodeURIComponent(userStr));
        console.log('Google OAuth successful - received token and user data:', userData);
        
        // Determine user type if not explicitly set
        let userType = userData.type;
        if (!userType) {
          // Check if email contains admin to determine type
          userType = userData.email?.toLowerCase().includes('admin') ? 'admin' : 'user';
        }
        
        // Ensure user data includes the type
        const processedUserData = {
          ...userData,
          type: userType
        };
        
        console.log('Processed user data with type:', processedUserData);
        
        // Create a response object compatible with our LoginResponse interface
        const response: LoginResponse = {
          token: token,
          admin: processedUserData, // Use the processed user data
          message: 'Google authentication successful'
        };
        
        // Store authentication data
        this.storeAuthData(response, false);
        
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        return response;
      }
      
      // Fallback: check for authorization code (original implementation)
      const code = urlParams.get('code');
      if (code) {
        const response = await apiService.handleGoogleCallback(code);
        console.log('Google OAuth successful via code exchange:', response);
        
        // Store authentication data
        this.storeAuthData(response, false);
        
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        return response;
      }
      
      return null;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Check if current page is handling Google OAuth callback
  isGoogleAuthCallback(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('token') || urlParams.has('code') || urlParams.has('error');
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
    
    console.log('AuthService: Storing auth data:', { response, rememberMe });
    
    storage.setItem(this.TOKEN_KEY, response.token);
    
    // Handle both admin and user properties for compatibility with different API responses
    const userData = response.admin || (response as any).user;
    console.log('AuthService: User data to store:', userData);
    
    if (userData) {
      storage.setItem(this.USER_KEY, JSON.stringify(userData));
      console.log('AuthService: Stored user data in storage');
    } else {
      console.warn('AuthService: No user data found in response');
    }
    
    console.log('AuthService: Auth data stored successfully');
    
    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_KEY, 'true');
    }
    
    // Dispatch event to notify components about auth state change
    window.dispatchEvent(new Event('authStateChanged'));

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
    
    console.log('AuthService: Cleared all auth data from storage');
    
    // Dispatch event to notify components about auth state change
    window.dispatchEvent(new Event('authStateChanged'));
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

  // Forgot password functionality
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await apiService.forgotPassword(email);
      console.log('Forgot password response received:', response);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Reset password functionality
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const response = await apiService.resetPassword(token, password);
      console.log('Reset password response received:', response);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Initialize auth state (call on app startup)
  initializeAuth(): { isAuthenticated: boolean; user: Admin | null; token: string | null } {
    const token = this.getToken();
    const user = this.getUser();
    const isAuthenticated = !!(token && user);

    console.log('AuthService: Initializing auth state:', { 
      token: token ? 'present' : 'missing', 
      user: user ? { email: user.email, type: user.type } : null, 
      isAuthenticated 
    });

    return {
      isAuthenticated,
      user,
      token
    };
  }
}

export const authService = new AuthService();
